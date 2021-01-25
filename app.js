var port = process.env.PO RT || 3000; 
const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
const session=require('express-session')
app.use(session({secret: 'test',
resave: false,
  saveUninitialized: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: false }))
var fs = require('fs')
var usernames = fs.readFileSync('pass.json')
var watchlist=fs.readFileSync('watchlist.json')
var allmovies=[{name:'The Godfather',source:'godfather'},{name:'The Godfather:Part II',source:'godfather2'},{name:'Fight Club',source:'fightclub'},{name:'The Dark Knight',source:'darkknight'},{name:'The Conjuring',source:'conjuring'},{name:'Scream',source:'scream'}]
var userwatchlist=[]
app.get('/', function (req, res) {
  res.render('login')
})
app.post('/register', function (req, res, next) {
  if(req.body.username==""){
    res.send('<p>USERNAME REQUIRED</p>') 
   } else{ if(req.body.password==""){
      res.send('<p>PASSWORD REQUIRED</p>')
    }else{
  if (usernames == "") {
   var temp={}
   temp[req.body.username]=req.body.password
   temp2=JSON.stringify(temp)
    
    fs.writeFileSync("pass.json", temp2)
    usernames = fs.readFileSync('pass.json')
    res.send('<p>REGISTERATION SUCCESSFUL</p>')

  } else {
    var usernames1 = JSON.parse(usernames)

    if (typeof usernames1[req.body.username] == "undefined") {
      usernames1[req.body.username] = req.body.password
      var final2 = JSON.stringify(usernames1)
      fs.writeFileSync("pass.json", final2)
      usernames = fs.readFileSync('pass.json')

      res.send('<p>REGISTERATION SUCCESSFUL</p>')
    } else {
      res.send('<p>ERROR:USERNAME ALREADY USED</p>')
    }
  }
    


}
   }
  }
)



app.post('/home', function (req, res) {

  if(usernames=='')
  {
    res.send('<p>Invalid username or password</p>')
  } else{
    var usernames1 = JSON.parse(usernames)
    if(usernames1[req.body.username]==req.body.password ){
      req.session.user=req.body.username
      res.render('home')
    }else{
      res.send('<p>Invalid username or password</p>')

    }
  }
  
})

app.post('/watchlistadd',function (req,res){
      if(watchlist==''){
        var obj={
        username:req.session.user,
        movies:[req.body.watch]
      };
      var array=[obj]
      array2=JSON.stringify(array)
      fs.writeFileSync('watchlist.json',array2)
      watchlist=fs.readFileSync('watchlist.json')
      res.send("Movie added to watchlist")
      
}
else{
  var userinwatchlist='false';
  var watchlist2 =JSON.parse(watchlist)
    if(searchinwatchlist(watchlist2,req.body.watch,req.session.user)){
        for(i=0;i<watchlist2.length;i++){
          if(watchlist2[i].username==req.session.user){
            userinwatchlist='true';
            (watchlist2[i].movies).push(req.body.watch)
            watchlist3=JSON.stringify(watchlist2)
            fs.writeFileSync('watchlist.json',watchlist3)
            watchlist=fs.readFileSync('watchlist.json')
            res.send("Movie added to watchlist")

          }
        }
        if(userinwatchlist=='false'){
          var newobj={
            username:req.session.user,
            movies:[req.body.watch]
          }
          watchlist2.push(newobj)
          watchlist4=JSON.stringify(watchlist2)
          fs.writeFileSync('watchlist.json',watchlist4)
          watchlist=fs.readFileSync('watchlist.json')
          res.send("movie added to watchlist")
         
        }
    }else{
      res.send('You already have this movie in your watchlist')
    }

}
}
)
function searchinwatchlist(watchlist,movie,user) {
  for (i=0; i<watchlist.length; i++) {
    if(watchlist[i].username==user){
      for(j=0 ;j<(watchlist[i].movies.length) ;j++){
       if(watchlist[i].movies[j]==movie){
         return false;
       }
      }
    }
  }
  return true;
}
app.get('/horror', function (req, res) {
 
  res.render('horror')

})

app.get('/registration', function (req, res) {
  res.render('registration')

})
app.get('/conjuring', function (req, res) {
  res.render('conjuring')
})

app.get('/action', function (req, res) {
  res.render('action')
})

app.get('/darkknight', function (req, res) {
  res.render('darkknight')
})

app.get('/drama', function (req, res) {
  res.render('drama')
})

app.get('/fightclub', function (req, res) {
  res.render('fightclub')
})

app.get('/godfather', function (req, res) {
  res.render('godfather')
})

app.get('/godfather2', function (req, res) {
  res.render('godfather2')
})

app.get('/scream', function (req, res) {
  res.render('scream')
})

app.post('/search', function (req, res) {
  var results=[]
  var target=req.body.Search
  var capitaltarget=target.toUpperCase()
  for(i=0;i<allmovies.length;i++){
    var a=(allmovies[i].name)
    var b=a.toUpperCase()
    if(b.includes(capitaltarget)){
      var result1={
        name:allmovies[i].name,
        source:allmovies[i].source
      }
      results.push(result1)
    }
  }
  if(results.length==0){
    res.send('Movie not found')
  }else{
        res.render('searchresults',{
          resultsdisplay:results
        })

  }
})
app.get('/watchlist', function (req, res) {
  userwatchlist=[]
  if(watchlist!=''){
    var watchlist5=JSON.parse(watchlist)
    for(i=0;i<watchlist5.length;i++){
     if(req.session.user==watchlist5[i].username){
       userwatchlist=watchlist5[i].movies
   
     }
    }
  }
 
  res.render('watchlist',{
    userswatchlist: userwatchlist
  })
})


app.listen(port)
