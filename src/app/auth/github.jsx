import GitHubLogin from 'react-github-login';
 
const onSuccess = response => console.log(response);
const onFailure = response => console.error(response);

export default function GitHubLoginFunction() {
  return (
    <GitHubLogin clientId="e9f2c2e4f3b1c5b3c7e3"
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );
}