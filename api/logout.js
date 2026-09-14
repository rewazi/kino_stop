export function logoutHandler(req, res) {
  req.session.destroy(() => res.json({ success: true }));
}

export default logoutHandler;
