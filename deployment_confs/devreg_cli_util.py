from datetime import datetime
import os
import subprocess


SERVER_NAME: str = "ens-phot-devreg.rd.tuni.fi"

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKUP_DIR = os.path.join(PROJECT_ROOT, "instance", "backup")
MANUAL_BACKUP_DIR = os.path.join(PROJECT_ROOT, "instance", "manual_backup")
DATABASE_PATH = os.path.join(PROJECT_ROOT, "instance", "database.db")



def run_com(com: list[str], sudo=False, cwd=PROJECT_ROOT):
    if sudo:
        com = ["sudo"] + com
    try:
        print(f"\n\tRUN: {' '.join(com)}\n"
              f"\tCWD: {cwd}")
        result = subprocess.run(com, check=True, text=True, capture_output=True,
                                cwd=cwd)
        print(f"\tOUT:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"\tERR: {' '.join(com)}:\n{e.stderr}")


def change_dir_tree_owners(owner, path):
    run_com(sudo=True, com=["chown", "-R", f"{owner}:{owner}", path])


def change_rights(access, path):
    run_com(sudo=True, com=["chmod", "-R", access, path])


def set_apache_conf():
    print("Generating Apache configuration...")
    replacements = {
        "{SERVER_NAME}": SERVER_NAME,
        "{PROJECT_ROOT}": PROJECT_ROOT
    }
    with open(os.path.join(THIS_DIR, "devreg.conf_TEMPLATE"), 'r') as file:
        content = file.read()
    for placeholder, value in replacements.items():
        content = content.replace(placeholder, value)
    with open(os.path.join(THIS_DIR, "devreg.conf"), 'w') as file:
        file.write(content)
    print(f"devreg.conf created @ {THIS_DIR}")

    print("Applying new configuration...")
    run_com(sudo=True, com=["cp", "devreg.conf",
                            os.path.join("/", "etc", "httpd", "conf.d", "devreg.conf")],
            cwd=THIS_DIR)


def deploy_backend():
    print("Installing Python dependencies for the backend...")
    run_com(sudo=True, com=["pip", "install", "-r", "requirements.txt"],
            cwd=os.path.join(PROJECT_ROOT, "backend"))

    run_com(sudo=True, com=["touch", f"{PROJECT_ROOT}/wsgi.py"],
            cwd=os.path.join(PROJECT_ROOT))

def deploy_frontend(update_packages = True):
    print("Installing JavaScript dependencies for the frontend...")
    run_com(sudo=False, com=["npm", "install"],
            cwd=os.path.join(PROJECT_ROOT, "frontend"))

    print("Building the frontend...")
    run_com(sudo=False, com=["npm", "run", "build"],
            cwd=os.path.join(PROJECT_ROOT, "frontend"))

    if update_packages:
        update_frontend_packages()

    print("Setting redirection rules...")
    run_com(sudo=False,
            com=["cp", ".htaccess", os.path.join(PROJECT_ROOT, "frontend", "dist")],
            cwd=THIS_DIR)

def update_frontend_packages():
    print("Updating frontend packages...")
    run_com(sudo=False, com=["npm", "audit", "fix"],
            cwd=os.path.join(PROJECT_ROOT, "frontend"))

def restart_httpd(hard_reset = False):
    if hard_reset:
        print("Restarting httpd... This will take some time.")
        run_com(sudo=True, com=["systemctl", "restart", "httpd"], cwd=THIS_DIR)
        return

    print("Reloading the HTTP server...")
    run_com(sudo=True, com=["systemctl", "reload", "httpd"], cwd=THIS_DIR)



def deploy_application():
    change_dir_tree_owners(os.getuid(), PROJECT_ROOT)
    set_apache_conf()
    # ensuring mod_wsgi installation
    run_com(sudo=True, com=["dnf", "install", "mod_wsgi"], cwd=PROJECT_ROOT)

    deploy_backend()
    deploy_frontend()

    # probably shouldn't change all the permissions
    change_rights("775", PROJECT_ROOT)
    run_com(sudo=True,
            com=["chcon", "-R", "-t", "httpd_sys_rw_content_t", PROJECT_ROOT])

    restart_httpd()

    print("Changing back to Apache ownership & setting correct rights...")
    change_dir_tree_owners("apache", PROJECT_ROOT)


def ensure_backup_dirs():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    os.makedirs(MANUAL_BACKUP_DIR, exist_ok=True)


def create_manual_backup():
    ensure_backup_dirs()
    if os.path.exists(DATABASE_PATH):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        manual_backup_path = os.path.join(MANUAL_BACKUP_DIR,
                                          f"manual_backup_{timestamp}.bak")
        run_com(sudo=True, com=["cp", DATABASE_PATH, manual_backup_path])
        print(f"Manual backup created: {manual_backup_path}")
    else:
        print("No database found to back up.")


def list_backups(backup_type="auto"):
    if backup_type == "auto":
        directory = BACKUP_DIR
    elif backup_type == "manual":
        directory = MANUAL_BACKUP_DIR
    else:
        print("Invalid backup type.")
        return []

    if not os.path.exists(directory):
        print(f"Backup directory does not exist: {directory}")
        return []

    backups = [f for f in os.listdir(directory) if f.endswith(".bak")]
    if not backups:
        print("No backup files found.")
    return backups


def restore_backup():
    ensure_backup_dirs()
    print("\nChoose backup type:")
    print("1. Automatic backups")
    print("2. Manual backups")
    choice = input("Select backup type (1 or 2): ").strip()

    if choice == "1":
        backup_type = "auto"
        backup_dir = BACKUP_DIR
    elif choice == "2":
        backup_type = "manual"
        backup_dir = MANUAL_BACKUP_DIR
    else:
        print("Invalid choice. Aborting.")
        return

    backups = list_backups(backup_type)
    if not backups:
        return

    print(f"\nAvailable {backup_type} backups:")
    for i, backup in enumerate(backups, start=1):
        print(f"{i}. {backup}")

    try:
        choice = int(input("\nSelect a backup file to restore (enter number): ").strip())
        if choice < 1 or choice > len(backups):
            print("Invalid selection. Aborting.")
            return
        selected_backup = backups[choice - 1]
    except ValueError:
        print("Invalid input. Please enter a number.")
        return

    backup_path = os.path.join(backup_dir, selected_backup)
    print(f"Restoring from backup: {backup_path}")

    create_manual_backup()

    run_com(sudo=True, com=["cp", backup_path, DATABASE_PATH])
    print(f"Database restored successfully from {selected_backup}.")

def show_menu():
    menu_options = {
        "1": ("Deploy application", deploy_application),
        "2": ("Set temporary project ownership to user",
              lambda: change_dir_tree_owners(os.getuid(), PROJECT_ROOT)),
        "3": ("Reload httpd (soft)", restart_httpd),
        "4": ("Restart httpd (hard)", lambda: restart_httpd(hard_reset=True)),
        "5": ("Deploy backend", deploy_backend),
        "6": ("Deploy frontend", lambda: deploy_frontend(update_packages=True)),
        "7": ("Create manual backup", create_manual_backup),
        "8": ("Restore database from backup", restore_backup),
        "0": ("Quit", None)
    }

    while True:
        print("\n### Device Register Utils CLI Menu ###")
        for key, (description, _) in menu_options.items():
            print(f"{key}. {description}")

        choice = input("Select an option: ").strip()
        if choice in menu_options:
            description, action = menu_options[choice]
            print(f"\nSelected: {description}")
            if action:
                action()
            else:
                print("Exiting CLI")
                break
        else:
            print("Invalid choice. Please try again.")


if __name__ == '__main__':
    show_menu()
