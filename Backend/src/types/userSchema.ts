import z from "zod"

export const UserSignUpSchema = z.object({
    first_name: z.string().max(100,"First name is too long").min(3,"First name must be atleast 3 characters"),
    middle_name: z.string().max(100,"Middle name is too long").min(3,"Middle name must be atleast 3 characters").nullish().transform((val) => val ?? "-"),
    last_name: z.string().max(100,"Last name is too long").min(3,"Last name must be atleast 3 characters"),
    email: z.string().email("Invalid email address!!!"),
    password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long"),
    confirm_password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long"),
    phone_no: z.string().length(10,"Phone number must be exactly 10 digits").regex(/^\d{10}$/,"Phone number must contain only digits"),
    home_address: z.string().max(100,"Address is too long").min(5,"Address is too short"),
    street: z.string().max(100,"Street name is too long").min(5,"Street name is too short"),
    state: z.string().max(100,"Street name is too long").min(5,"Street name is too short"),
    city: z.string().max(100,"City name is too long").min(5,"City name is too short"),
    pin_code: z.string().length(6,"Pin Code must be exactly 6 digits").regex(/^\d{6}$/,"Pin Code must contain only digits"),
})

export const UserLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8,"Password is too short").regex(/[A-Z]/,"* password must have at least one uppercase letter").regex(/[0-9]/, "* password must have at least one number").regex(/[\W_]/,"* password must have atleast one special character").max(50,"Password is too long")
})