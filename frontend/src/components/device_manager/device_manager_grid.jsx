import React, { useState, useEffect, useRef } from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import Function_button from '../shared/function_button.jsx';
import ConfirmationPopup from './confirmation_popup.jsx';
import useFetchData from '../shared/fetch_data';
import useDelete from '../shared/delete_data.jsx';

const Device_manager_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices/');
    const [updatedDevices, setDevices] = useState([]);
    const { deleteData } = useDelete();
    const popupRef = useRef(null);
    const [expandAll, setExpandAll] = useState(false);

    useEffect(() => {
        if (devices) {
            const devicesWithState = devices.map((device) => ({
                ...device,
                isExpanded: false,
            }));
            setDevices(devicesWithState);
        }
    }, [devices]);

    const handleRowToggle = (rowId) => {
        // Prevent row toggle if popup is active
        if (popupRef.current && popupRef.current.isOpen()) {
            return;
        }

        setDevices((prevDevices) =>
            prevDevices.map((device) =>
                device.dev_id === rowId
                    ? { ...device, isExpanded: !device.isExpanded }
                    : device
            )
        );
    };

    const handleExpandCollapseAll = () => {
        setExpandAll((prevState) => {
            const newExpandState = !prevState;
            setDevices((prevDevices) =>
                prevDevices.map((device) => ({
                    ...device,
                    isExpanded: newExpandState,
                }))
            );
            return newExpandState;
        });
    };

    const handleModify = (rowId) => {
        window.location.href = `/devices/${rowId}/edit`;
    };

    const handleDelete = async (rowId) => {
        const idToDelete = [{ id: rowId }];
        setDevices((prevDevices) =>
            prevDevices.filter((device) => device.dev_id !== rowId)
        );

        try {
            await deleteData('devices/', idToDelete);
        } catch (error) {
            console.error(`Failed to delete device with ID: ${rowId}`, error);
        }
    };

    const columnDefs = [
        {
            field: 'dev_name',
            headerName: 'Device',
            flex: 3,
            minWidth: 200,
            cellRenderer: (params) => {
                const devId = params.data.dev_id;
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ fontWeight: 'bold', flexGrow: 1 }}>
                            {params.value}
                        </div>
                        {params.data.isExpanded && (
                            <div
                            style={{
                                gap: '7px',
                                marginBottom: '7px',
                                display: 'flex',
                            }}>
                            <Function_button text="Modify" 
                                onClick={() => handleModify(devId)} />
                                <ConfirmationPopup
                                    renderTrigger={() => (
                                    <Function_button
                                        text="Delete"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            popupRef.current.openPopup(); 
                                        }}
                                    />
                                    )}
                                onConfirm={() => handleDelete(devId)}
                                dialogTitle="Delete Device"
                                dialogText="Are you sure you want to delete this device?"
                                ref={popupRef} // Attach the ref to the popup
                            />
                            </div>
                        )}
                    </div>
                );
            },
            cellStyle: {
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: 1.2,
                paddingTop: '13px',
            },
        },
        {
            field: 'dev_manufacturer',
            headerName: 'Manufacturer',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'dev_model',
            headerName: 'Model',
            flex: 1.5,
            minWidth: 150,
        },
        {
            field: 'class_name',
            headerName: 'Class',
            flex: 2,
            minWidth: 200,
        },
    ];

    const getRowHeight = (params) => (params.data.isExpanded ? 100 : 60);

    const getRowStyle = () => ({
        cursor: 'pointer',
    });

    if (loading) {
        return (
            <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 10vw, 2.4rem)' }}>
                Loading devices...
            </Typography>
        );
    }

    if (error) {
        return (
            <Typography sx={{ mt: 7, fontSize: 'clamp(1.5rem, 9vw, 2.4rem)', color: 'red' }}>
                Failed to load devices.<br />
                Please try again later.<br />
            </Typography>
        );
    }

    return (
        <div>
            <Function_button
                size="small"
                text={expandAll ? 'Collapse rows' : 'Expand rows'}
                onClick={handleExpandCollapseAll}
            />
            <GridTable
                rowData={updatedDevices}
                columnDefs={columnDefs}
                getRowStyle={getRowStyle}
                getRowHeight={getRowHeight}
                onRowClicked={(event) => handleRowToggle(event.data.dev_id, event)}
            />
        </div>
    );
};

export default Device_manager_grid;
