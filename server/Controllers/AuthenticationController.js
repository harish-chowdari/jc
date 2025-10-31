const AdminSchema = require("../Models/AdminAuthModel.js");
const UserSchema = require("../Models/UserAuthModel.js");

async function AdminSigUp(req, res) {
    try {
        const { name, email, password } = req.body;

        const isUserExist = await AdminSchema.findOne({ email: email });

        if (isUserExist) { 
            return res.status(400).json({ error: "Account already exists" });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const data = new AdminSchema({
            name,
            email,
            password,
            otp: "",
            otpExpiresAt: "",
        });

        const d = await data.save();
        return res.status(200).json(d);
    } catch (error) {
        console.log(error);
    }
}

async function AdminLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const isUserExist = await AdminSchema.findOne({ email: email });
        if (!isUserExist) {
            return res.status(404).json({ error: "User does not exist" });
        }

        if (password !== isUserExist.password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        return res.status(200).json(isUserExist);
    } catch (error) { 
        console.log(error);
    }
}


async function UserSigUp(req, res) {
    try {
        const { name, email, password } = req.body;

        const isUserExist = await UserSchema.findOne({ email: email });

        if (isUserExist) { 
            return res.status(400).json({ error: "Account already exists" });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const data = new UserSchema({
            name,
            email,
            password,
            otp: "",
            otpExpiresAt: "",
        });

        const d = await data.save();
        return res.status(200).json(d);
    } catch (error) {
        console.log(error);
    }
}

async function UserLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Please fill all the fields" });
        }

        const isUserExist = await UserSchema.findOne({ email: email });
        if (!isUserExist) {
            return res.status(404).json({ error: "User does not exist" });
        }

        if (password !== isUserExist.password) {
            return res.status(401).json({ error: "Incorrect password" });
        }

        return res.status(200).json(isUserExist);
    } catch (error) { 
        console.log(error);
    }
}

module.exports = {
  AdminSigUp,
  AdminLogin,
  UserSigUp,
  UserLogin
};
