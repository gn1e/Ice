
app.get('/api/launcher/news/public', (req, res) => {

  const jsonResponse = {
    status: "success",
    data: [
      {
        id: 1,
        title: "launcher news",
        description: "describe your news and updates here",
        date: "2024-11-06",
      },
      {
        id: 2,
        title: "same here",
        description: "lowkey good for launcher",
        date: "2024-11-13",
      },
    ],
  };


  res.json(jsonResponse);
});
