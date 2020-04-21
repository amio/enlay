# enlay

Inlay text file with env variables

## Install & Usage

```bash
npm install -g enlay
```

```
USAGE

    enlay nginx_template.conf > nginx.conf

INLAY RULES

    "${HOME}"                         => "/root"
    "${NONE_EXIST}"                   => "${NONE_EXIST}"
    "${NONE_EXIST:-localhost:3000}"   => "localhost:3000"
    "${NONE_EXIST:-}"                 => ""
```

## License

MIT License
