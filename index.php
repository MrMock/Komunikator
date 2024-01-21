<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <title>Strona logowania</title>
</head>
<body>
<div class="form-box">
    <?php session_start(); ?>
    <?php if (isset($_SESSION['error_message'])): ?>
        <div class="error-message"><?php echo $_SESSION['error_message']; unset($_SESSION['error_message']); ?></div>
    <?php endif; ?>
    <form action="login.php" method="post">
        <input type="text" name="username" placeholder="Login">
        <input type="password" name="password" placeholder="Hasło">
        <button type="submit" class="action-button">Zaloguj</button>
    </form>
    <button onclick="window.location.href='registration.php'" class="action-button">Zarejestruj</button>
</div>
</body>
</html>