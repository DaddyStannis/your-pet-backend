POST users/register/

```
request:
{
  email: string,
  password: string
}

response:
status 201
{
  email: string
}
```

POST users/login/

```
request:
{
  email: string,
  password: string
}

response:
status 200
{
  email: string,
  token: string
}
```

POST users/logout/

```
request:
{}

response:
status 204
{}
```

GET users/current/

```
request:
{}

response:
status 200
{
  email: string,
}
```

PATCH users/avatars/

```
request:
binary file

response:
status 200
{
  avatarURL: string
}
```

GET users/me/

```
request:
{}

response:
status 200
{
  name: string, // null if the user is newly registered
  birthday: string, // null
  phone: string, // null
  city: string, // null
  email: string,
  avatarURL: string
}
```

PATCH users/me/

```
request:
{
  any model field
}

response:
status 200
{
  name: string,
  birthday: string,
  phone: string,
  city: string,
  email: string,
  avatarURL: string
}
```
