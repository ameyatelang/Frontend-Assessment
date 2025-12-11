"use client"

import React, {useEffect, useState} from "react";
import {Table, Typography, Card, CardContent,
    TableContainer, TableRow, TableCell,
    TableHead, TableBody, Chip, Button,
    createTheme, ThemeProvider} from "@mui/material";


interface Op{
    opId: number,
    opTitle: string,
    publicId: string,
    operatorsNeeded: string,
    startTime: string,
    endTime: string,
    operators: Operator[]
}

interface Operator{
    id: number,
    firstName: string,
    lastName: string,
    opsCompleted: number,
    reliability: number,
    endorsements: string[]
}

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

const font = createTheme({
    typography: {fontFamily: 'Montserrat, sans-serif'}
})

const GetOp: React.FC = () =>{

    const [op, setOp] = useState<Op[]>([]);
    const [workerCheckIn, setWorkerCheckIn] = useState<Record<string, {checkIn: string, checkOut: string}>>({});

    const handleCheckIn = (workerId: number) =>{
        setWorkerCheckIn((opr)=>{
            const curOpr = opr[workerId] || {};
            if(!curOpr.checkIn){
                return{
                    ...opr,
                    [workerId]: {checkIn: dateFormat(new Date().toLocaleString())}
                }
            }else if(!curOpr.checkOut){
                return{
                    ...opr,
                    [workerId]: {...curOpr, checkOut: dateFormat(new Date().toLocaleString())}
                }
            }else{
                return opr;
            }
        });
    }

    useEffect(() => {
        fetch("https://frontend-challenge.veryableops.com/")
            .then((payload) => payload.json())
            .then((opArray: Op[]) => setOp(opArray))
            .catch((error) => console.error(error))
    },[])

    useEffect(() => {
        localStorage.setItem("Check In/Out Timings", JSON.stringify(workerCheckIn));
    }, [workerCheckIn]);

    return(
        <div>
            <ThemeProvider theme={font}>
            {op.map((opChoice) => (
                <Card key={opChoice.opId} sx={{marginBottom: '3rem'}} >
                    <CardContent>
                        <Typography sx={{fontWeight: 'bold'}}>{opChoice.opTitle}</Typography>
                        <Typography>Public ID: {opChoice.publicId}</Typography>
                        <Typography>Operators Needed: {opChoice.operatorsNeeded}</Typography>
                        <Typography>Start Time: {dateFormat(opChoice.startTime)}</Typography>
                        <Typography>End Time: {dateFormat(opChoice.endTime)}</Typography>

                        <TableContainer sx={{marginTop: '2rem'}}>

                            <Table sx={{border: '1px solid lightgrey', borderBottom: '1px solid lightgrey'}}>
                                <TableHead sx={{backgroundColor: 'lightgrey'}}>
                                    <TableRow>
                                        <TableCell sx={{fontWeight: 'bold'}} >Name</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} >Ops Completed</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} >Reliability</TableCell>
                                        <TableCell align="center" sx={{fontWeight: 'bold'}} >Endorsements</TableCell>
                                        <TableCell sx={{fontWeight: 'bold'}} >Check In/Out</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {opChoice.operators.map((opr) => (
                                        <TableRow key={opr.id} hover>
                                            <TableCell>{opr.firstName + " " + opr.lastName}</TableCell>
                                            <TableCell align="center">{opr.opsCompleted}</TableCell>
                                            <TableCell align="center">{(opr.reliability * 100).toString()+"%"}</TableCell>
                                            <TableCell>
                                                {opr.endorsements.map((msg, idx)=>(
                                                    <Chip key={idx} label={msg}/>
                                                ))}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="outlined" onClick={() => handleCheckIn(opr.id)} disabled={Boolean(workerCheckIn[opr.id]?.checkIn && !!workerCheckIn[opr.id]?.checkOut)}>
                                                    {!workerCheckIn[opr.id]?.checkIn ? "Check In" : !workerCheckIn[opr.id]?.checkOut ? "Check Out" : "Recorded"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>

            ))}
            </ThemeProvider>
        </div>
    );

}

export default GetOp;