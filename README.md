# Bime Sina Project

Starting date - 4/8

## GENERAL RESPONSE MAP

```
response : {
success: Boolaen,
err : Boolean,
message : String,
data : MIX|Array|Object
}
```

### AUTH ROUTE SPECIFICATIONS

```
Routes => [
{
url : '/api/auth/singin-start',
auth : public ,
method : 'POST',
parameters : {
    phone_number : String|optional,
    email : String|Email|optional,
},
details : 'Users could singin through sms service, email or phone number or even both are acceptable. Omitting both parameters throw error'
},

{
url : '/api/auth/register-complete',
auth : public ,
method : 'POST',
parameters : {
    code : String|Required
},
details : 'GUESTS COULD COMPLETE REGISTRATION'
},

{
url : '/api/auth/jwt-student',
auth : public ,
method : 'GET',
details : 'DEVELOPER COULD AUTHENTICATE AS A STUDENT THROUGH THIS API'
},

{
url : '/api/auth/jwt-admin',
auth : public ,
method : 'GET',
details : 'DEVELOPER COULD AUTHENTICATE AS A ADMIN THROUGH THIS API'
},

{
url : '/api/auth/is-authenticated',
auth : public ,
method : 'GET',
details : 'RETURNS IF THE USER IS AUTHENTICATED OR NOT, USED FOR FRONT END DEVELOPMENT ROUTERS'
}
]

```

### USER ROUTE SPECIFICATIONS

```
Routes => [
{
url : '/api/user/get-user-information',
auth : private,
method : 'POST'
users : Students,
details : 'USER COULD GET THE CURRENT USER INFORMATION'
},

{
url : '/api/user/update-user-information',
auth : private ,
method : 'POST'
users : Students,
parameters : {
    name: string|required,
    lastname: string|required,
    email: string|email|required,
    image : file|optional
},
details : 'USER COULD UPDATE PROFILE INFORMATION THROUGH THIS API'
},

{
url : '/api/user/submit-phone-number',
auth : private ,
method : 'POST'
users : Students,
parameters : {
    phone_number: string|required,

},
details : 'USER COULD UPDATE THEIR PHONE_NUMBER RECORD IN CASES WHICH THE USER HAS BEEN REGISTERED VIA EMAIL INFORMAITON'
},

{
url : '/api/user/verify-phone-number',
auth : private ,
method : 'POST'
users : Students,
parameters : {
    code: string|required,

},
details : 'USER COULD SUBMIT THE CODE TO UPDATE THE PHONE_NUMBER
},

{
url : '/api/user/submit-peyment-request',
auth : private ,
method : 'POST'
users : Students,
parameters : {
    amount: string|Int|required,
},
details : 'USER COULD INCREASE TOTAL USER BALACE'
},

]


```

### ADMIN ROUTE SPECIFICATIONS

```

Routes => [
{
url : '/api/admin/get-all-users',
auth : private ,
method : 'POST'
users : Admin,
details : 'ADMIN COULD GET LIST OF ALL USERS'
},

{
url : '/api/admin/update-user-block',
auth : private ,
method : 'POST'
users : Admin,
parameters : {
    phone_number: string|optional,
},
details : 'ADMIN COULD UPDATE USER BLOCK STATUS'
},

{
url : '/api/admin/update-single-user',
auth : private ,
method : 'POST'
user : admin,
parameters : {
    phone_number : String|optional,
    name: string|required,
    lastname: string|required,
    email: string|optional,
    balance: string|Int|required,
    image : file|optional
},
details : 'ADMIN UPDATE SINGLE USER'
},

]
```

## License

[GPLV3](https://choosealicense.com/licenses/gpl-3.0/)
