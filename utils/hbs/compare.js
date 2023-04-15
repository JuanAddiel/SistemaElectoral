exports.EqualValue = (value,EqualValue) => {
    return value === EqualValue;
}
exports.and = (a,b)=>{
    return a&&b;
}

exports.estatus = (v1, v2)=>{
    v2.forEach(v => {
        
    });
    if(v1 === v2.estado){
        return true;
    }
    return false;
    
}