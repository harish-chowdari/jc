const getUserId = () => {
    const userId = localStorage.getItem('userId')
    return userId
}

export default getUserId