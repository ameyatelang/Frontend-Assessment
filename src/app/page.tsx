/**
 * Ameya Telang -- Veryable FrontEnd Challenge
 */

"use client"

import {Box, Stack, TextField, Typography } from "@mui/material";
import { WavyBackground } from "@/components/ui/wavy-background";
import GetOp from "@/app/op";
import "./main.css";
import logo from './logo.png';
import Image from "next/image";
import {useState} from "react";

export default function Home() {

    const [filter, setFilter] = useState("");

    return (
    <div>
        <WavyBackground className="fixed w-full">
        <Image src={logo} alt="logo" style={{
            width: "15rem",
            marginTop: '1rem',
            marginLeft: '2rem'
        }}/>
        <Stack
            sx={{
                width: "100%",
                height: "100vh",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "-5rem"
            }}
        >
        <Box sx={{
            display: "flex",
            marginBottom: "2rem"
        }}>
            <Typography sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'thin',
                fontSize: '1.5rem',
                textDecoration: 'underline'
                }}>
                    OP LISTINGS

            </Typography>
            <TextField
                size="small"
                label="Filter listings..."
                value={filter}
                onChange={(event)=>setFilter(event.target.value)}
                sx={{
                    marginLeft: "53em"
                }}
            />
        </Box>

            <GetOp filter={filter}/>
        </Stack>
        </WavyBackground>
    </div>
  );
}
