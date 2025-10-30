import * as React from "react";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled } from "@mui/material/styles";
import api from "../../api/axiosInstance";

const FormGrid = styled(Grid)(() => ({
    display: "flex",
    flexDirection: "column",
}));

export default function AddressForm() {
    const [formData, setFormData] = React.useState({
        fullname: "",
        address: "",
        age: "",
        city: "",
        phonenumber: "",
        email: "",
    });

    React.useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        const role = localStorage.getItem("jwt_role");

        // Κάνε fetch μόνο αν υπάρχει token ΚΑΙ είναι customer
        if (!token || (role && role.toLowerCase() !== "customer")) return;

        api
            .get("/Customer/me")
            .then((res) => {
                const data = res.data || {};
                setFormData({
                    fullname: data.fullname || "",
                    email: data.email || "",
                    age: data.age ?? "",
                    phonenumber: data.phoneNumber || "",
                    city: data.city || "",
                    address: data.address || "",
                });
            })
            .catch((err) => {
                console.error("Failed to fetch customer info", err);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <Grid container spacing={3}>
            <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="fullname" required>
                    Full name
                </FormLabel>
                <OutlinedInput
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Your full name"
                    autoComplete="name"
                    required
                    size="small"
                />
            </FormGrid>

            <FormGrid item xs={12} md={6}>
                <FormLabel htmlFor="phonenumber" required>
                    Phone number
                </FormLabel>
                <OutlinedInput
                    id="phonenumber"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    autoComplete="tel"
                    required
                    size="small"
                    type="tel"
                    inputProps={{ inputMode: "tel" }}
                />
            </FormGrid>

            <FormGrid item xs={12}>
                <FormLabel htmlFor="email" required>
                    Email
                </FormLabel>
                <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    autoComplete="email"
                    required
                    size="small"
                />
            </FormGrid>

            <FormGrid item xs={12}>
                <FormLabel htmlFor="age">Customer's Age</FormLabel>
                <OutlinedInput
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Your age"
                    size="small"
                    type="number"
                    inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
                />
            </FormGrid>

            <FormGrid item xs={12}>
                <FormLabel htmlFor="address" required>
                    Address line
                </FormLabel>
                <OutlinedInput
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street name and number"
                    autoComplete="address-line1"
                    required
                    size="small"
                />
            </FormGrid>

            <FormGrid item xs={6}>
                <FormLabel htmlFor="city" required>
                    City
                </FormLabel>
                <OutlinedInput
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    autoComplete="address-level2"
                    required
                    size="small"
                />
            </FormGrid>
        </Grid>
    );
}

