exports.createQuestion = (req,res) => {
    const {userType} = req.user
    if (userType === 'admin') {
        const { questionText } = req.body
        const questionId = global.QUESTIONS.length + 1
        const question = { questionId, questionText }
        
        global.QUESTIONS.push(question)
        console.log(`Question added: ${JSON.stringify(question)}`)
        res.status(201).json(question)
    } else {
        res.status(401).json({ message: `User Not allowed to add Question`})
    }
}

exports.getAllQuestions = (req, res) => {
    res.json(global.QUESTIONS)
}
