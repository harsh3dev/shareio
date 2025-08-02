### TODO:

#### Phase 1:
- [ ] update cors of share-service to only allow the cli access
- [ ] Deploy the cli and latest share-service to prod
- [ ] Publish the package to npm registry
- [ ] vibe code basic landing page and deploy
- [ ] Test the prod
- [ ] Update the root README

#### Phase 2:
- [ ] write unit tests for the cli
- [ ] find edge cases and scalability issues
- [ ] improve the scalability

#### Phase 3:
- [ ] find potential security pitfalls
- [ ] improve the security



### RAW Notes
the cli app will contain these features
- a cli based tool which could accept the following commands -> post and get
- it will be used like `npx shareio post <file\_location> --pass 1234`
- where shareio is the name of the package
- post is the command to send the file
- pass is optional parameter which will be the password to lock the file
- similarly `npx shareio get <file_code> --pass 1234`
- here file code will be the port number which will be received when doing post
- get will be used to download the file and will be downloaded in the current directory
- it will then print on the terminal the location of the downloaded file
- when doing post the terminal will be showing the progress of the file upload

the client will send the password initially
and then we have to check in the backend
if there is a password  attached to the file which we can know from the hashmap
then check the password match or not
if match then normally process the file
else if doesn't match simply return the error response
if the file doesn't have a password attached for now simply just process the file no over engineering
