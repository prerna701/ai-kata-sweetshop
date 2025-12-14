db.createUser({
  user: 'sweet_user',
  pwd: 'sweet_password',
  roles: [
    {
      role: 'readWrite',
      db: 'sweet_shop'
    }
  ]
});