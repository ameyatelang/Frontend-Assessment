"use client"

import React, {useEffect, useState} from "react";
import {Typography, Card, CardContent, Chip, Button, createTheme, ThemeProvider, TextField} from "@mui/material";
import DataTable, { TableColumn } from "react-data-table-component";
import './op.css';


/**
 * Extracting needed fields for each Op
 */
interface Op{
    opId: number,
    opTitle: string,
    publicId: string,
    operatorsNeeded: string,
    startTime: string,
    endTime: string,
    operators: Operator[]
}

/**
 * Extracting needed fields for each Operator
 */
interface Operator{
    id: number,
    firstName: string,
    lastName: string,
    opsCompleted: number,
    reliability: number,
    endorsements: string[]
}

/**
 * Converts date string into readable format
 * @param date
 */
export function dateFormat(date: string): string{
    const newDate = new Date(date);
    return newDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

//Setting the theme for MUI elements with chosen font
const font = createTheme({
    typography: {fontFamily: 'Montserrat, sans-serif'}
})

/**
 * React component for MUI cards displaying each Op and relevant info
 * @param filter
 * @constructor
 */
const GetOp: React.FC<{filter: string}> = ({filter}) =>{

    const [op, setOp] = useState<Op[]>([]);
    const [workerCheckIn, setWorkerCheckIn] = useState<Record<string, {checkIn: string, checkOut: string, buttonColor: boolean}>>({});

    /**
     * Handler for check in/out functionality per operator
     *
     * @remarks
     *Based on the state of the checkIn and checkOut strings
     * the handler returns the record with when the button was clicked
     * and changes the color
     *
     * @param workerId
     */
    const handleCheckIn = (workerId: number) =>{
        setWorkerCheckIn((opr)=>{
            const curOpr = opr[workerId] || {};
            if(!curOpr.checkIn){
                return{
                    ...opr,
                    [workerId]: {checkIn: dateFormat(new Date().toLocaleString()), buttonColor: true}
                }
            }else if(!curOpr.checkOut){
                return{
                    ...opr,
                    [workerId]: {...curOpr, checkOut: dateFormat(new Date().toLocaleString()), buttonColor: false}
                }
            }else{
                return opr;
            }
        });
    }

    /**
     * Filter logic to filter the cards by opTitle, publicId, or operators
     * when typed into MUI textField
     */
    const filterListings = op.filter(
        (card)=> card.opTitle.toLowerCase().includes(filter.toLowerCase()) ||
            card.publicId.includes(filter) ||
             card.operators.some((findOpr) =>
                (findOpr.firstName + " " + findOpr.lastName).toLowerCase().includes(filter.toLowerCase()))
    )

    /**
     * Fetching the JSON data from the endpoint
     */
    useEffect(() => {
        fetch("https://frontend-challenge.veryableops.com/")
            .then((payload) => payload.json())
            .then((opArray: Op[]) => setOp(opArray))
            .catch((error) => console.error(error))
    },[])

    /**
     * Storing operatorID and timestamps of checkIn and checkOut
     * to local storage
     */
    useEffect(() => {
        localStorage.setItem("Check In/Out Timings", JSON.stringify(workerCheckIn));
    }, [workerCheckIn]);

    /**
     * Defining all the columns to display operator info
     * Name, Ops Completed, and Reliability are all sortable
     */
    const cols: TableColumn<Operator>[] = [
        {
            name: (
                <div style={{fontWeight: "bold", fontSize:"13px"}}>
                    Name
                </div>
            ),
            width: 'auto',
            selector: (opr) => `${opr.firstName} ${opr.lastName}`,
            sortable: true
        },
        {
            name: (
                <div style={{textAlign:"center", fontWeight: "bold", fontSize:"13px"}}>
                    Ops Completed
                </div>
            ),
            width: "200px",
            selector: (opr) => opr.opsCompleted,
            cell: (row) => (
                <div style={{textAlign:"center", width:"50%"}}>
                    {row.opsCompleted}
                </div>
            ),
            sortable: true
        },
        {
            name: (
                <div style={{textAlign:"center", fontWeight: "bold", fontSize:"13px"}}>
                    Reliability
                </div>
            ),
            width: "150px",
            selector: (opr) => opr.reliability,
            cell: (row) => (
                <div style={{width: "50%", textAlign:"center"}}>
                    {(row.reliability * 100).toString()+'%'}
                </div>
            ),
            sortable: true
        },
        {
            name: (
                <div style={{width: "100%", textAlign:"center", fontWeight: "bold", fontSize:"13px"}}>
                    Endorsements
                </div>
            ),
            width: "500px",
            cell: (row) => (
                <div style={{display: "flex", width: "100%"}}>
                    {row.endorsements.map((msg:string, idx:number)=>(
                        <Chip key={idx} label={msg}></Chip>
                    ))}
                </div>
            )
        },
        {
            name: (
                <div style={{width: "100%", textAlign:"center", fontWeight: "bold", fontSize:"13px"}}>
                    Check In/Out
                </div>
            ),
            width: "150px",
            cell: (row) => (
                <div style={{width: "100%", textAlign:"center"}}>
                    <Button variant="outlined" color={workerCheckIn[row.id]?.buttonColor ? "error" : "success"} onClick={() => handleCheckIn(row.id)} disabled={Boolean(workerCheckIn[row.id]?.checkIn && !!workerCheckIn[row.id]?.checkOut)}>
                        {!workerCheckIn[row.id]?.checkIn ? "Check In" : !workerCheckIn[row.id]?.checkOut ? "Check Out" : "Recorded"}
                    </Button>
                </div>
            )
        }
    ]


    return(
        <div>
            <ThemeProvider theme={font}>

                {filterListings.map((opChoice) => (

                <Card key={opChoice.opId} sx={{marginBottom: '3rem'}}>
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold'}}>{opChoice.opTitle}</Typography>
                        <Typography>Public ID: {opChoice.publicId}</Typography>
                        <Typography>Operators Needed: {opChoice.operatorsNeeded}</Typography>
                        <Typography>Start Time: {dateFormat(opChoice.startTime)}</Typography>
                        <Typography>End Time: {dateFormat(opChoice.endTime)}</Typography>
                        <div className="dataTable">
                            <DataTable
                                columns={cols}
                                data={opChoice.operators}
                                highlightOnHover
                                customStyles={{
                                    headRow:{
                                        style:{
                                            backgroundColor: "lightgrey",
                                            justifyContent: "center",
                                            gap: '0.1rem'
                                        }
                                    }
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

            ))}

            </ThemeProvider>
        </div>
    );

}

export default GetOp;