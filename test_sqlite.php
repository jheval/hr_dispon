<?php
phpinfo(INFO_MODULES);
?>
<?php
if (extension_loaded('sqlite3')) {
    echo "SQLite3 is enabled\n";
    echo "SQLite3 version: " . SQLite3::version()['versionString'] . "\n";
    
    try {
        $db = new SQLite3('test.db');
        echo "Successfully created test database\n";
        $db->close();
        unlink('test.db');
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "SQLite3 is NOT enabled\n";
    echo "Loaded extensions:\n";
    print_r(get_loaded_extensions());
}
?>