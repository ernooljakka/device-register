import os
import subprocess

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVER_NAME = "ens-phot-devreg.rd.tuni.fi"

def run_com(com: list[str], sudo=False, cwd=PROJECT_ROOT):
    if sudo:
        com = ["sudo"] + com
    try:
        print(f"\n\tRUN: { ' '.join(com)}\n"
              f"\tCWD: {cwd}")
        result = subprocess.run(com, check=True, text=True, capture_output=True, cwd=cwd)
        print(f"\tOUT:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        print(f"\tERR: {' '.join(com)}:\n{e.stderr}")


def change_dir_tree_owners(owner, path):
    run_com(sudo=True, com=["chown", "-R", f"{owner}:{owner}", path])

def change_rights(access, path):
    run_com(sudo=True, com=["chmod", "-R", access, path])


def create_apache_conf():
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


if __name__ == '__main__':
    print("temporarily set project ownership")
    change_dir_tree_owners(os.getuid(), PROJECT_ROOT)

    print("#### BACKEND ####")
    print("installing python dependencies...")
    run_com(sudo=True, com=["pip", "install", "-r", "requirements.txt"], cwd=os.path.join(PROJECT_ROOT, "backend"))

    print("#### FRONTEND ####")
    print("installing js dependencies...")
    run_com(sudo=False, com=["npm", "install"], cwd=os.path.join(PROJECT_ROOT, "frontend"))
    print("building project")
    run_com(sudo=False, com=["npm", "run", "build"], cwd=os.path.join(PROJECT_ROOT, "frontend"))
    print("setting redirection rules")
    run_com(sudo=False, com=["cp", ".htaccess", os.path.join(PROJECT_ROOT, "frontend", "dist")], cwd=THIS_DIR)

    print("#### DEPLOYMENT ####")
    print("generating apache config")
    create_apache_conf()
    print("applying new config")
    run_com(sudo=True, com=["cp", "devreg.conf", os.path.join("/", "etc", "httpd", "conf.d", "devreg.conf")], cwd=THIS_DIR)
    print("change back to apache ownership & set correct rights")
    change_dir_tree_owners("apache", PROJECT_ROOT)
    change_rights("775", PROJECT_ROOT)
    run_com(sudo=True, com=["chcon", "-R", "-t", "httpd_sys_rw_content_t", PROJECT_ROOT])
    print("reload httpd server to finish deployment")
    run_com(sudo=True, com=["systemctl", "reload", "httpd"], cwd=THIS_DIR)
