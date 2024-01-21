<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <title>Strona rejestracji</title>
</head>
<body>
    <div class="form-box">
        <?php session_start(); ?>
        <?php if (isset($_SESSION['error_message'])): ?>
            <div class="error-message"><?php echo $_SESSION['error_message']; unset($_SESSION['error_message']); ?></div>
        <?php endif; ?>
        <form action="signup.php" method="post">
            <input type="text" name="username" placeholder="Login">
            <input type="email" name="email" placeholder="Email">
            <input type="password" name="password" placeholder="Hasło">
            <input type="password" name="confirm_password" placeholder="Potwierdź hasło">
            <button type="submit" class="action-button">Zarejestruj</button>
        </form>
        <button onclick="window.location.href='index.php'" class="action-button">Powrót do logowania</button>
    </div>
</body>
</html>