// Temporary script to get all pro tips
fetch('http://localhost:3001/api/supabase/posts')
  .then(response => response.json())
  .then(data => {
    data.posts.forEach((post, index) => {
      if (post.pro_tip) {
        console.log(`=== Day ${index + 1} (${post.day}) ===`);
        console.log(post.pro_tip);
        console.log('');
      }
    });
  })
  .catch(error => console.error('Error:', error));
