import z from "zod";

export const DeliverSignupSchema = z.object({
    first_name: z.string().max(100,"First name is too long").min(3,"First name must be atleast 3 characters"),
    middle_name: z.string().max(100,"Middle name is too long").min(3,"Middle name must be atleast 3 characters").nullish().transform((val) => val ?? "-"),
    last_name: z.string().max(100,"Last name is too long").min(3,"Last name must be atleast 3 characters"),
    email: z.string().email("Invalid email address!!!"),
    password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long"),
    confirm_password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long"),
    phone_no: z.string().length(10,"Phone number must be exactly 10 digits").regex(/^\d{10}$/,"Phone number must contain only digits"),
    vehicle_number: z.string().regex(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/, {message: "Invalid number plate format. Example: TN09CH6494",}),
    vehicle_type: z.enum(["bicycle", "bike", "scooter", "car", "van", "truck"]),
    assigned_area: z.string()
})

export const DeliverLoginSchema = z.object({
    email: z.string().email("Invalid email address!!!"),
    password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long")
})