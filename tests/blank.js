const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('ttt')
        }, time)
    })
}

const run = async () => {
    for (let i = 0; i < 3; i++) {
        const res = await sleep(1000)
        console.log(res)
    }
}
run()

