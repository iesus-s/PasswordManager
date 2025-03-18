const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Password copied to clipboard');
  };

  export default copyToClipboard;