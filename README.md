# Node.JS - Cluster
  - The script will print
    - Every 1sec `Number of requests so far`
    - Every 5sec `Reports with total number of requests per each worker`
    - On every request `User-Agent`


## Test the app
  - run `ab -n 50000 -c 50 http://localhost:8000/`

## Requirement
  - Node 6.5.0
  - "ab" Apache HTTP server benchmarking tool
