export const statusCode = {
    info : 300
}

export const getStatusType = (code : string) => {
    if(Number(code) === statusCode.info){
        return 'info'
    }
    else {
        return 'error'
    }
}