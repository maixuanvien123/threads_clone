import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/helper/generateTokenAndSetCookie.js";


const signupUser = async(req,res) => {
    try {
        const {name,userName,email,password} = req.body;
        const user = await User.findOne({$or:[{email},{userName}]});

        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            name,
            userName,
            email,
            password:hashedPassword
        });
        await newUser.save();

        if(newUser){
            generateToken(newUser._id,res);
            res.status(200).json({
                _id:newUser._id,
                name:newUser.name,
                userName:newUser.userName,
                email:newUser.email,
                password:newUser.password
            })
        }else{
            res.status(400).json({message: "Invalid user data"});
        }


    } catch (error) {
        res.status(500).json({message: error.message})
        console.log("Error in signupUser:",error.message)
    }
};

const loginUser = async(req,res) => {
    try {
        const {userName,password} = req.body;
        const user = await User.findOne({userName});

        if(!user){
          return res.status(400).json({message: "Username not exist"});
        }
        const isPasswordCorrect = await bcrypt.compare(password,user.password || "");
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Your input password is wrong"});
        }
        
        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email, 
            userName:user.userName,
        });
   



    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in login ",error.message);
    }
};

const logOut = async(req,res) =>{
    try {
		res.cookie("jwt", "", { maxAge: 1 });
		res.status(200).json({ message: "User logged out successfully" });
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in signupUser: ", err.message);
	}
};

const followUnFollowUser = async (req,res) =>{
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if(id === req.user._id.toString() ){
            return res.status(400).json({message:"You cannot follow yourself"});
        }
        if(!userToModify || !currentUser){
            return res.status(400).json({message:"User not found"});
        }
        const isFollowing = currentUser.following.includes(id);

        if(isFollowing){
            await User.findByIdAndUpdate(req.user._id,{$pull :{following:id}});
            await User.findByIdAndUpdate(id,{$pull: {followers:req.user._id}});                              
            return res.status(200).json({ message: "User unfollowed successfully" });
        }
        await User.findByIdAndUpdate(req.user._id,{$push:{following: id}});
        await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}});
        res.status(200).json({ message: "User followed successfully" });
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("",error.message);
    }
};

const updateUser = async(req,res) =>{
    try {
        const {name,email,userName,password,profilePic,bio} = req.body;
        const userId = req.user._id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        
        if(req.params.id !== userId.toString()){
            return res.status(400).json({message:"You cannot update other user's profile"});
        }

        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.userName = userName || user.userName;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        await user.save();
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email, 
            userName:user.userName,
        });


        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(" ",error.message);
    }
}

const getProfile = async(req,res) =>{
    try {
        const {userName} = req.params;
        const user = await User.findOne({userName}).select("-password").select("-createdAt");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("",error.message);
    }
}


export {signupUser,loginUser,logOut,followUnFollowUser,updateUser,getProfile};