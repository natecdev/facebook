const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser())



var users = [
    {
        'username': 'anhtoi',
        'password': 'toi123',
        'name': 'Nguyen Anh Toi'
    },
    {
        'username': 'anhtuan',
        'password': '123tuan',
        'name': 'Nguyen Anh Tuan'
    }
]
var session_cookies = []

const login = (user, pass) => {
    user_data = users.find(
        (e) => {
            return e.username == user && e.password == pass
        }
    )
    return user_data
}

const register = (user, pass, name) =>{
    new_user = {
        'username': user,
        'password': pass,
        'name': name
    }
    users.push(new_user)
}


app.get('/', (req, res) => {
    session = session_cookies.find((e) => {
        return e.sess_id == req.cookies.sess_id
    })
    if (session == null) {
        return res.redirect('/login')
    }
    user = session.user
    res.send("Facebook is here. Welcome " + user.name)
})

app.get('/login', (req, res) => {
    res.sendFile('/home/natec/code/Node js/html/login.html')
})

app.post('/login', (req, res) => {
    user = login(req.body.user, req.body.pass)
    if (user == null) {
        res.send('Wrong username or password')
    }
    else {
        sess_id = Math.random().toString(36).substring(7);
        session_cookies.push({
            'sess_id': sess_id,
            'user': user
        })
        console.log(sess_id)
        console.log(session_cookies)
        res.cookie('sess_id', sess_id);
        res.redirect('/')
    }
})

app.get('/logout', (req,res) =>{
    session_cookies = session_cookies.filter( (item) => {
        return item.sess_id !== req.cookies.sess_id
    })
    res.redirect('/login')
})

app.get('/register',(req,res) => {
    res.sendFile('/home/natec/code/Node js/html/register.html')
})

app.post('/register', (req, res) =>{
    usern = req.body.user.trim()
    var letters = /^[A-Za-z]+$/;
    if(!usern.match(letters)){
        return res.send('Thong tin khong hop le')
    }
    check = users.find( (e) => {
        return e.username == usern 
    })
    if(check != null) return res.send('tai khoan da ton tai')
    register(req.body.user, req.body.pass, req.body.name)
    
    res.send('Thanh cong')
})

app.listen(3000, () => {
    console.log("application start on port 3000")
})


