import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MuiCard from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import SimCardRoundedIcon from "@mui/icons-material/SimCardRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

const Card = styled(MuiCard)(({ theme }) => ({
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.divider,
    width: "100%",
    "&:hover": {
        background:
            "linear-gradient(to bottom right, hsla(210, 100%, 97%, 0.5) 25%, hsla(210, 100%, 90%, 0.3) 100%)",
        borderColor: "primary.light",
        boxShadow: "0px 2px 8px hsla(0, 0%, 0%, 0.1)",
        ...theme.applyStyles("dark", {
            background:
                "linear-gradient(to right bottom, hsla(210, 100%, 12%, 0.2) 25%, hsla(210, 100%, 16%, 0.2) 100%)",
            borderColor: "primary.dark",
            boxShadow: "0px 1px 8px hsla(210, 100%, 25%, 0.5) ",
        }),
    },
    [theme.breakpoints.up("md")]: {
        flexGrow: 1,
        maxWidth: `calc(50% - ${theme.spacing(1)})`,
    },
    variants: [
        {
            props: ({ selected }) => selected,
            style: {
                borderColor: (theme.vars || theme).palette.primary.light,
                ...theme.applyStyles("dark", {
                    borderColor: (theme.vars || theme).palette.primary.dark,
                }),
            },
        },
    ],
}));

const PaymentContainer = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    height: 375,
    padding: theme.spacing(3),
    borderRadius: `calc(${theme.shape.borderRadius}px + 4px)`,
    border: "1px solid ",
    borderColor: (theme.vars || theme).palette.divider,
    background:
        "linear-gradient(to bottom right, hsla(220, 35%, 97%, 0.3) 25%, hsla(220, 20%, 88%, 0.3) 100%)",
    boxShadow: "0px 4px 8px hsla(210, 0%, 0%, 0.05)",
    [theme.breakpoints.up("xs")]: {
        height: 300,
    },
    [theme.breakpoints.up("sm")]: {
        height: 350,
    },
    ...theme.applyStyles("dark", {
        background:
            "linear-gradient(to right bottom, hsla(220, 30%, 6%, 0.2) 25%, hsla(220, 20%, 25%, 0.2) 100%)",
        boxShadow: "0px 4px 8px hsl(220, 35%, 0%)",
    }),
}));

const FormGrid = styled("div")(() => ({
    display: "flex",
    flexDirection: "column",
}));

export default function PaymentForm() {
    const [paymentType, setPaymentType] = React.useState("creditCard");

    // Διαβάζουμε από sessionStorage (ΟΧΙ localStorage)
    const [cardNumber, setCardNumber] = React.useState(
        sessionStorage.getItem("cardNumber") || ""
    );
    const [cvv, setCvv] = React.useState(sessionStorage.getItem("cvv") || "");
    const [expirationDate, setExpirationDate] = React.useState(
        sessionStorage.getItem("expirationDate") || ""
    );
    const [cardHolder, setCardHolder] = React.useState(
        sessionStorage.getItem("cardHolder") || ""
    );

    // Αν δεν υπάρχει token, καθάρισε άμεσα τα πεδία & το sessionStorage (safety)
    React.useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            ["cardNumber", "cvv", "expirationDate", "cardHolder"].forEach((k) =>
                sessionStorage.removeItem(k)
            );
            setCardNumber("");
            setCvv("");
            setExpirationDate("");
            setCardHolder("");
        }
    }, []);

    const handlePaymentTypeChange = (event) => {
        setPaymentType(event.target.value);
    };

    const handleCardNumberChange = (event) => {
        const digits = event.target.value.replace(/\D/g, "");
        const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        if (digits.length <= 16) {
            setCardNumber(formatted);
            sessionStorage.setItem("cardNumber", formatted);
        }
    };

    const handleCvvChange = (event) => {
        const digits = event.target.value.replace(/\D/g, "");
        if (digits.length <= 3) {
            setCvv(digits);
            sessionStorage.setItem("cvv", digits);
        }
    };

    const handleExpirationDateChange = (event) => {
        const digits = event.target.value.replace(/\D/g, "");
        const formatted = digits.replace(/(\d{2})(?=\d{2})/, "$1/");
        if (digits.length <= 4) {
            setExpirationDate(formatted);
            sessionStorage.setItem("expirationDate", formatted);
        }
    };

    const handleCardHolderChange = (event) => {
        const val = event.target.value;
        setCardHolder(val);
        sessionStorage.setItem("cardHolder", val);
    };

    return (
        <Stack spacing={{ xs: 3, sm: 6 }} useFlexGap>
            <FormControl component="fieldset" fullWidth>
                <RadioGroup
                    aria-label="Payment options"
                    name="paymentType"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                    }}
                >
                    <Card selected={paymentType === "creditCard"}>
                        <CardActionArea
                            onClick={() => setPaymentType("creditCard")}
                            sx={{
                                ".MuiCardActionArea-focusHighlight": { backgroundColor: "transparent" },
                                "&:focus-visible": { backgroundColor: "action.hover" },
                            }}
                        >
                            <CardContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CreditCardRoundedIcon
                                    fontSize="small"
                                    sx={[
                                        (theme) => ({
                                            color: "grey.400",
                                            ...theme.applyStyles("dark", { color: "grey.600" }),
                                        }),
                                        paymentType === "creditCard" && { color: "primary.main" },
                                    ]}
                                />
                                <Typography sx={{ fontWeight: "medium" }}>
                                    Credit/Debit Card
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </RadioGroup>
            </FormControl>

            {paymentType === "creditCard" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <PaymentContainer>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2">Credit card</Typography>
                            <CreditCardRoundedIcon sx={{ color: "text.secondary" }} />
                        </Box>

                        <SimCardRoundedIcon
                            sx={{
                                fontSize: { xs: 48, sm: 56 },
                                transform: "rotate(90deg)",
                                color: "text.secondary",
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                                gap: 2,
                            }}
                        >
                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-number" required>
                                    Card number
                                </FormLabel>
                                <OutlinedInput
                                    id="card-number"
                                    inputMode="numeric"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                    size="small"
                                    value={cardNumber}
                                    onChange={handleCardNumberChange}
                                />
                            </FormGrid>

                            <FormGrid sx={{ maxWidth: "20%" }}>
                                <FormLabel htmlFor="cvv" required>
                                    CVV
                                </FormLabel>
                                <OutlinedInput
                                    id="cvv"
                                    inputMode="numeric"
                                    placeholder="123"
                                    required
                                    size="small"
                                    value={cvv}
                                    onChange={handleCvvChange}
                                />
                            </FormGrid>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-name" required>
                                    Name
                                </FormLabel>
                                <OutlinedInput
                                    id="card-name"
                                    placeholder="John Smith"
                                    required
                                    size="small"
                                    value={cardHolder}
                                    onChange={handleCardHolderChange}
                                />
                            </FormGrid>

                            <FormGrid sx={{ flexGrow: 1 }}>
                                <FormLabel htmlFor="card-expiration" required>
                                    Expiration date
                                </FormLabel>
                                <OutlinedInput
                                    id="card-expiration"
                                    inputMode="numeric"
                                    placeholder="MM/YY"
                                    required
                                    size="small"
                                    value={expirationDate}
                                    onChange={handleExpirationDateChange}
                                />
                            </FormGrid>
                        </Box>
                    </PaymentContainer>
                </Box>
            )}

            {paymentType === "bankTransfer" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Alert severity="warning" icon={<WarningRoundedIcon />}>
                        Your order will be processed once we receive the funds.
                    </Alert>
                </Box>
            )}
        </Stack>
    );
}
