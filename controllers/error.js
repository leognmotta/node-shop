exports.get404Page = (req, res, next) => {
  res.status(404).render('not_found', { pageTitle: 'Page Not Found' });
};
