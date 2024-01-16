*NOTES*

What I learned is how git works and how to work with github, I learned how to push and pull from a remote repo and how to fix conflicts.

**AWS**

Create an EC2 instance that runs with a public ip. Register a domain name using route 53 and create a record that maps it to the ec2 public ip. One needs to be included for the root domain and one for all the subdomains

**HTTPS/TLS**
HTTPS is Secure Hypertext Transport Protocol. A certificate with a public/private key is given by a certificate issuer who verifies the owner's authenticity. This also allows the client to verify the certifate's signing by the issuer, verify the server identity throught the public key, and finally share a symmetric key with which to continue communication. Mozilla's `Let's Encrypt` allows free certificates for domain names and caddy uses this to generate certificates

**DNS**
- tld are com, net, click
- root domains are the next level
- use `dig` to view dns records
- use `whois` to get registrant info
- DNS servers refer to authoritative name servers to resolve an address
- records:
  - A is address, simply maps name to address
  - CNAME is canonical name and is alias for another domain
- Names are ussually cached by browsers or intermediate parties
- A TTL (time to live) setting exists to invalidate caches after a specified period of time

**HTML**

***Basics***
- body tag composed of header, main, footer
- h1/2/3/4.. headers
- p paragraph
- b bold
- img src= width= alt= display image
- a href= target= Display link to somewhere
- ul/ol list
- li list item
- table table
- tr row
- th header element
- td row element
- thead, tbody, tfoot for more structure  

block dirupts flow with a distinct element, inline follows it