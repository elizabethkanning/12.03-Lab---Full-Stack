var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple To-Do', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

router.post('/create', function (req, res, next) {
    const { task } = req.body;
    if (task.trim() === '') {
      res.send(`
        <script>
          alert("Please enter text!");
          window.location.href = "/";
        </script>
      `);
    } 
    else {
      try {
        req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
          if (err) {
            console.error('Error adding todo:', err);
            return res.status(500).send('Error adding todo');
          }
          console.log('Todo added successfully:', results);
          // Redirect to the home page after adding
          res.redirect('/');
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).send('Error adding todo');
      }
    }
});

router.post('/delete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error deleting todo:', err);
          return res.status(500).send('Error deleting todo');
        }
        console.log('Todo deleted successfully:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).send('Error deleting todo:');
    }
});

router.post('/markComplete', function (req, res, next) {
    const { id } = req.body;
    try {
      req.db.query('UPDATE todos SET completed = TRUE WHERE id = ?;', [id], (err, results) => {
        if (err) {
          console.error('Error updating mark complete:', err);
          return res.status(500).send('Error updating mark complete');
        }
        console.log('Todo marked complete:', results);
        // Redirect to the home page after deletion
        res.redirect('/');
    });
    }catch (error) {
        console.error('Error updating mark complete:', error);
        res.status(500).send('Error updating mark complete:');
    }
}); 

//need to update the edit function
router.post('/edit', function (req, res, next) {
    const { task, id } = req.body; 
    if (task.trim() === '') {
      res.send(`
        <script>
          alert("Please enter text!");
          window.location.href = "/";
        </script>
      `);
    } 
    else {
      try {
        req.db.query('UPDATE todos SET task = ? WHERE id = ? ;', [task, id], (err, results) => { 
          if (err) {
            console.error('Error editing todo:', err);
            return res.status(500).send('Error editing todo');
          }
          console.log('Todo edited successfully:', results);
          // Redirect to the home page after deletion
          res.redirect('/');
      });
      }catch (error) {
          console.error('Error editing todo:', error);
          res.status(500).send('Error editing todo:');
      }
    }
}); 

module.exports = router;