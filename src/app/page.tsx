import { Stack, Typography } from "@mui/material";
import GetOp from "@/app/op";
import "./main.css";

export default function Home() {
  return (
    <div className="background">
        <Typography sx={{
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 'normal',
            fontSize: '2rem',
            marginLeft: '2rem',
            paddingTop: '1rem',
        }}>
            VERYABLE
        </Typography>
        <Stack
            sx={{
            width: "100%",
            height: "100vh",
            justifyContent: "center",
            alignItems: "center"
            }}
        >
            <Typography sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 'thin',
                fontSize: '1.5rem',
                marginBottom: '2rem',
                textDecoration: 'underline'
                }}>
                    OP LISTINGS
            </Typography>
            <GetOp/>
        </Stack>
    </div>
  );
}
