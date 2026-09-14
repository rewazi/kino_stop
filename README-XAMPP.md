# Авторизация через XAMPP

1. Скопируйте папку проекта в `C:\xampp\htdocs\my_project`.
2. Запустите в XAMPP модули **Apache** и **MySQL**.
3. Откройте `http://localhost/phpmyadmin`.
4. Выберите вкладку **Импорт**, укажите файл `database.sql` и выполните импорт.
5. Откройте сайт по адресу `http://localhost/my_project/`.

По умолчанию подключение использует MySQL-пользователя `root` без пароля. Если настройки XAMPP отличаются, измените значения `DB_USER` и `DB_PASSWORD` в `api/config.php`.

Пароли не хранятся в открытом виде: API использует `password_hash`, подготовленные SQL-запросы и PHP-сессии.
