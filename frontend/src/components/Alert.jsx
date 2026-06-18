const Alert = ({ message, type = 'warning' }) => {
  if (!message) return null;

  const styles = {
    warning: 'bg-yellow-50 border border-yellow-300 text-yellow-800',
    error: 'bg-red-50 border border-red-300 text-red-800',
    success: 'bg-green-50 border border-green-300 text-green-800',
  };

  return (
    <div className={`rounded px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {message}
    </div>
  );
};

export default Alert;
