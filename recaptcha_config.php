<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Direct return of site key - no config dependency
echo json_encode([
    'siteKey' => '6LeJArErAAAAACj8P0jXHJu0D9FWOY6kkC3xiinh'
]);
?>