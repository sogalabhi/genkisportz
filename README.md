# genkisportz Deep Link Site

This folder hosts static files for domain-based deep links on:

- `https://genkisportz.in/tournament/<id>?invite=<code>`

## Folder layout

- `index.html`: basic landing/diagnostic page
- `tournament/index.html`: fallback page when app is not installed
- `assets/app.js`: route parsing and app launch / copy-link actions
- `assets/styles.css`: shared styling
- `.well-known/assetlinks.json`: Android App Links verification file
- `.well-known/apple-app-site-association`: iOS Universal Links verification file

## Hosting and rewrites

Your host must:

1. Serve `/.well-known/*` as static files without rewriting.
2. Rewrite `/tournament/*` to `/tournament/index.html`.

Example Nginx:

```nginx
location ^~ /.well-known/ {
  try_files $uri =404;
}

location ^~ /tournament/ {
  try_files /tournament/index.html =404;
}
```

## Deployment order

1. Deploy this static site and verify:
   - `https://genkisportz.in/.well-known/assetlinks.json`
   - `https://genkisportz.in/.well-known/apple-app-site-association`
2. Deploy Android/iOS builds with app links configured for `genkisportz.in`.
3. Verify invite links on devices.

## App IDs placeholders

Update before production:

- `.well-known/assetlinks.json`
  - `package_name`
  - `sha256_cert_fingerprints`
- `.well-known/apple-app-site-association`
  - `appIDs` (`TEAM_ID.bundle_id`)

## QA matrix

- Android installed user opens domain invite link -> app opens tournament.
- iOS installed user opens domain invite link -> app opens tournament.
- App not installed -> fallback page shows with `Open in App` and `Copy Invite Link`.
- Logged out user opening invite -> login then resume join flow.
- Logged in user opening invite -> join CTA flow works.
- In-app browser (Instagram/Facebook) -> helper text visible.

