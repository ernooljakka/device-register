import React from 'react';
import GridTable from '../shared/grid_table.jsx';
import Typography from '@mui/material/Typography';
import Function_button from '../shared/function_button.jsx';
import useFetchData from '../shared/fetch_data';
import useDelete from '../shared/delete_data.jsx';
import { useNavigate } from 'react-router-dom';

const Device_manager_grid = () => {
    const { data: devices, loading, error } = useFetchData('devices/');
    const { deleteData} = useDelete();
    const navigate = useNavigate(); 



    const handleModify = (rowId) => {
        navigate('/devices/' + rowId + '/edit');
;
    };
    
    const handleDelete = async(rowId) => {
        
        const id = [{ id: rowId }];
        
        try {
            await deleteData('devices/', id);
            navigate('/admin');
        } catch (error) {
            console.error(`Failed to delete device with ID: ${rowId}`, error);
        }
        
    };
    

    const columnDefs = [
        
        { field: "dev_name", filter: "agTextColumnFilter", headerName: "Device", flex: 2,  minWidth: 120, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            }, // Important, 34 characters
        {
            headerName: "Actions",
            field: "actions",
            minWidth: 200,
            cellRenderer: (params) => {
                const devId = params.data.dev_id;
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Function_button text='Modify' onClick={() => handleModify(devId)}></Function_button>
                        <Function_button text='Delete' color='error' onClick={() => handleDelete(devId)}></Function_button>
                    </div>
                );
            },
            cellStyle: { display: 'flex', justifyContent: 'space-between', paddingTop: '13px' },
        },
        { field: "dev_manufacturer", filter: "agTextColumnFilter", headerName: "Manufacturer", flex: 0.5, minWidth: 120, autoHeight: true,
             cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            }, // Enough for 9999 devices
        { field: "dev_model", filter: "agTextColumnFilter", headerName: "Model", flex: 1.4, minWidth: 100, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
        }, // Not as important, 14 characters
        { field: "class_name", filter: "agTextColumnFilter", headerName: "Class", flex: 2, minWidth: 120, autoHeight: true,
            cellStyle: { whiteSpace: 'normal', wordWrap: 'break-word',  lineHeight: 1.2,  paddingTop: '13px', } // text wrapping
            },
    ];

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
        <GridTable 
            rowData={devices} 
            columnDefs={columnDefs}
            /*getRowStyle={getRowStyle}*/
        />
    );
};

export default Device_manager_grid;