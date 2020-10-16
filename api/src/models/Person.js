const {DataTypes,Sequelize}=require("Sequelize");

module.exports=(sequelize)=>{
    sequelize.define("Person",{
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING,
            alloNull:false,
        },
        dni:{
            type:DataTypes.STRING,
            allowNull:false
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:true,
        },
        birthDate:{
            type:DataTypes.DATE,
            allowNull:false
        },
        address:{
            type:DataTypes.TEXT
        },
        regionId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        country_id:{
            type:DataTypes.STRING,
            allowNull:false
        }


    });
}