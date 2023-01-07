let data = {options:[{type:"string", value:"This is the string value!"}]}
let badData = {};

for(var i of data?.options) {
    console.log(i.type, i.value);
}
if(badData?.options)
for(var i of badData?.options) {
    console.log(i.type, i.value);
}