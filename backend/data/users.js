import bcrypt from "bcryptjs";

const users = [
    {
        name:"Admin User",
        email:"admin@example.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:"Sangam Dange",
        email:"Sangam@example.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
    {
        name:"Sugam Dange",
        email:"sugam@example.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true
    },
]


export default users;