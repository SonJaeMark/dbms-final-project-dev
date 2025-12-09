-- 1 ADMIN
INSERT INTO users (email, password_hash, password_salt, full_name, role)
VALUES
('admin@example.com', 'da598f72510ae484dada3acc021f223a2a547906133c1b7de76a735e18613878', '2caed9e65c89ed503382490a9638be68
', 'Admin User', 'admin');

-- 14 JOB LISTER USERS
INSERT INTO users (email, password_hash, password_salt, full_name, role)
VALUES
('lister1@example.com', 'e85caf5931ca19a360f60fbb9f8a47462aa3890cb971923937f3290800928432', '8ea7bb51502c23c3f784fb9db5396cec', 'Lister User 1', 'job_lister'),
('lister2@example.com', 'e0a2d2984a45dacceb167326b1a46af87815cf32af6fc86e44e5ef454c2533c7', '2b791a5ecfe137459daf1ad11fc87cfc', 'Lister User 2', 'job_lister'),
('lister3@example.com', 'f863cc52872d009feac650062b7a0cfa44109d4bddcc6925f95e2b4eb0eaa38f', '036dd2d68eac36e3364e493ef405ac28', 'Lister User 3', 'job_lister'),
('lister4@example.com', '040a30437994c81bd68233e614d72c9eccb1a6945c8e22e62d5911cf8085b412', '471d5d638df3726ce979404f75e75f1c', 'Lister User 4', 'job_lister'),
('lister5@example.com', 'c408c690f8adef706519bfaeeedec1130c31eb43857dd572895b67c668ddcd87', 'fd788f5a221a31fbc47398c70a670cc9', 'Lister User 5', 'job_lister'),
('lister6@example.com', 'cb820faca9257a1de744b43c78174749fefa490cbd0bbcbfca1f3b441ac9c8f2', '2b421aa441e6b81d701bae7ae0c578a8', 'Lister User 6', 'job_lister'),
('lister7@example.com', '61ea25fa4bfcfb226c8e68a0758bf20e0d540abcde7a5a4b8053365d1b678568', '97d2ba3606c5a16c57980b7a4180e0b8', 'Lister User 7', 'job_lister'),
('lister8@example.com', '82c47bbf72afb85248a72cf9dac62004d971b6987efbb2fed3d7c82747d556b2', 'cf5dd079644da43a20701a1eab6319db', 'Lister User 8', 'job_lister'),
('lister9@example.com', '5d91b23ca569df96f406a5f26b4d2ede855bc6854759335e1e197fb358bc1e8c', '327c747d15dcdc1167afd072fa1219e9', 'Lister User 9', 'job_lister'),
('lister10@example.com','6e5162cb0966a2703aca795d0eae26637b4ae92e94b337acea1c65d27d609d62','043baa9b2c7eaff524c2867efd8bd66f', 'Lister User 10', 'job_lister'),
('lister11@example.com','3d0d2252d46dc191aa319141021474d459ff3d08a43a903dd7e4f3c5ac21dc44','5a928d2e3b3c8dbca4ad8864fe23b04b', 'Lister User 11', 'job_lister'),
('lister12@example.com','455e52d3442d7ad6e7b78d54164761843c26f9f036626c6de5bbf4de4f62e227','2e060a62f56aaf1702835357d1d6c55f', 'Lister User 12', 'job_lister'),
('lister13@example.com','328f9b7ae75386c04661f0f1b6849164a61db41786044ce15ff5234b6b75c1bf','75d3a257ddabdf3ce2171ebfa53a3b86', 'Lister User 13', 'job_lister'),
('lister14@example.com','185e72a677a5da69967b212473d0a8a5f3441037ade00424bd7682d51d6753d1', 'bb8da7a58f331d6cf1cb60f16b53bb99', 'Lister User 14', 'job_lister');

-- 35 JOB SEEKERS
INSERT INTO users (email, password_hash, password_salt, full_name, role)
VALUES
('seeker1@example.com',  '8db5ba593b6b7aa5a9aeed36029dc261b7f361c3a8e139ba436d59bef66c7910', '79bcf4b1858041166416b6cc44a187e0', 'Seeker User 1', 'job_seeker'),
('seeker2@example.com',  '6bf47b1729013250605da35d3a434dbe5af878385d4f6dbf5fdffed56ecf2bdd', 'dcc64c33345131d322570304a029a22d', 'Seeker User 2', 'job_seeker'),
('seeker3@example.com',  'fcdcb7de60230e58ecf52c80d8c908db667aa44d32a593696d2e33419f36208a', '502413209da2b355b500b3a8821c78e6', 'Seeker User 3', 'job_seeker'),
('seeker4@example.com',  'c860c2bd653752b26a8c4a6831c25f07e1636549d88ed93260c4221605d93399', 'bc161e52b5e1f50377f91c06f3250481', 'Seeker User 4', 'job_seeker'),
('seeker5@example.com',  '3d6ab5374305f7b5c802cd07fe97a750d0ef234e4a4a90faea0b06f939d13aa7', '2095723a00e0b8bbf30b02ae56c7b412', 'Seeker User 5', 'job_seeker'),
('seeker6@example.com',  'cbcf668ef7545f2960fcc56c5141b6db3b0b6f74ea4447012aa04140a33481f3', '3acc095ea54dbca385035518c1a5fc5b', 'Seeker User 6', 'job_seeker'),
('seeker7@example.com',  '04b734e70a5cad1e4c5a5a5e1c7edc8d6bb2f6d3f83aaefffc308b9bdefa23d1', '08df96cc40ceb425c5170971eb1168b6', 'Seeker User 7', 'job_seeker'),
('seeker8@example.com',  'd62bb13378628d8d77dbbd78fb327e470285c55f8d607c4d7789cf0562f03140', '476eedd33f2aabdf8ddf98f287aa87bc', 'Seeker User 8', 'job_seeker'),
('seeker9@example.com',  '4aad19919401f4f7a3cb174b318076a704f5441985dfc054e02b37db345e2073', '7c0d54e55d7b77264bcf3a5efe9689f3', 'Seeker User 9', 'job_seeker'),
('seeker10@example.com', 'e5b8e509715d43230d559286022fdb0fbb21860408eed99441ad382f6a926f0d', 'f97c8c7539609d52d7d52cf888e4fb99', 'Seeker User 10', 'job_seeker'),
('seeker11@example.com', 'd0496ed0e5bf37fdf958fb5c1f335f887db89992f9bc9898b002da2ef1af7d9d', '1ecf99e86a19eb4789a1154f93a17ad7', 'Seeker User 11', 'job_seeker'),
('seeker12@example.com', '8d34848181aac2aad45f698f5a6afdaca8db49206974f921c2393f84d33e0b00', '1f06edf9a7b8a5794efc446d5342e908', 'Seeker User 12', 'job_seeker'),
('seeker13@example.com', 'b7d227d61c520cc9e6e5a0a84ed34accc7dd5cf685a33af0d84303dd37933e2a', '92d6058d54b1870b1bf0b062434eaa6e', 'Seeker User 13', 'job_seeker'),
('seeker14@example.com', '4be476a23dc741524a29aed0a509ec9512fc6401725b55aa0b96064f33768c84', 'f4e672d384619dfbbe93c4dd22af9e4f', 'Seeker User 14', 'job_seeker'),
('seeker15@example.com', '35c667a8487d978f476106e53afafabdee38199b7dac41b7ff1aecb171d1f9be', '41623e882bb789b0ee59d1241bcee4a7', 'Seeker User 15', 'job_seeker'),
('seeker16@example.com', 'b82a8268bc61a21acd83df5c809247c2829249a95cfb5d616bcb9337a2e81e88', 'f17a2ffe32cb73a5779acd8b7103ba45', 'Seeker User 16', 'job_seeker'),
('seeker17@example.com', 'a7a463d7b927ba44006776d2f161cefc9acfc08fad6caec4bb42453c1abe3b85', 'c5f61a089f3d7a1f5338e29684db67fc', 'Seeker User 17', 'job_seeker'),
('seeker18@example.com', '046905eb9bc18a81ab8e5ced1858573a8177c1565a193c11d81db71b280d4c16', '6fd965fdd0aed99a9d2a35ab9927585f', 'Seeker User 18', 'job_seeker'),
('seeker19@example.com', 'a023fb253b769774fd3a3484443883ed8326cacf76b404ecf76be55a1221a07c', 'e937d21e0bd5b5abdbec2aa953e23c3b', 'Seeker User 19', 'job_seeker'),
('seeker20@example.com', '951b5b1328d2aa26db82dd2d39379b432a342ab0b170123acdede2e0a413dd44', '4b7324acfc64c7b452f56dc6301a8742', 'Seeker User 20', 'job_seeker'),
('seeker21@example.com', '106beee64eb77346fb1a5a523cc961dc7c4f8388cba864dda6bd9e472f7e9de9', '462edfdd26c507111811dab47be03e44', 'Seeker User 21', 'job_seeker'),
('seeker22@example.com', 'a4193d807614657bbcdbe9a75ead8acabe3ebc63e36d00468c20121edca2a43c', '3d4d9055bebdc593c3972516eda8b0f8', 'Seeker User 22', 'job_seeker'),
('seeker23@example.com', 'fd2777af496df8c811d0f7e79c6ffb1e83e223bd1dab32eb7eadde2000e63fc0', '6201f8cc8b69f00513c4e94fb2bcd690', 'Seeker User 23', 'job_seeker'),
('seeker24@example.com', '051b667ff3b4522e77b1a239ad94077694acfcf326a33f4d3c729c30380a8eed', 'c396de8f5230c39efbd8a32981f26a66', 'Seeker User 24', 'job_seeker'),
('seeker25@example.com', '5d364f3d1e965dc1a77e7ef90f1e0b05c1687e8701d79eb43e692d57a0b7b04f', 'b9e539f8ee3ebdaac8b60322648793ef', 'Seeker User 25', 'job_seeker'),
('seeker26@example.com', '855383da4d7d84dfaf57c79adbe9d779a3de0a3b1e4a1b081900b17e6c671440', 'd22535e523bab9f0a31dd0d96e6d1c87', 'Seeker User 26', 'job_seeker'),
('seeker27@example.com', 'b40e615db5df9c5805ba8b8acdc34ef636a86b67da07c1e2c6ee57109a5cf8b9', '2cd30bb661a3e6569dbeebb3061746b7', 'Seeker User 27', 'job_seeker'),
('seeker28@example.com', '5fae07e7f06a4f28946884dc8e829e4450c12f8744ba41ab592b5506b9427700', 'd832b01e57e4d02e919ba83f5cbb7b36', 'Seeker User 28', 'job_seeker'),
('seeker29@example.com', 'a154fa2890c3a2d761c624f16c8759f2cbf11404fc34b2aaba2bbe8d6f91a3e4', '087c39c015787b5d8665618fcc6f95bc', 'Seeker User 29', 'job_seeker'),
('seeker30@example.com', 'eac4a03bc2b4551d18eb13e906af62636426c5e7c88c841e280159dd1846cd3e', 'c4a5e16da203850c84e51d3b345ad93f', 'Seeker User 30', 'job_seeker'),
('seeker31@example.com', 'b75a5afea6db690a905572a5402946e3decbd61ef3afe84ff325aa2a29234211', '52ef280428d9f3ec30f4120fa0b3040c', 'Seeker User 31', 'job_seeker'),
('seeker32@example.com', 'ece788af9e6f9bff3684d0b4fd7e48d3e8909b8bb265ad7729f82a5643dbeebe', 'ca30fcfade37a14fe4bebc96e7afcdd5', 'Seeker User 32', 'job_seeker'),
('seeker33@example.com', '581202898403eb6f8485c3c4c5868091123234fe5b3eaeef539fc2c1362a9dc5', 'fd209d75b1eab23f23a65f5ce13f7fd5', 'Seeker User 33', 'job_seeker'),
('seeker34@example.com', '23c67ba0f52359e545c44cf3fbca613fb85f7dc52c92582ceee123883e702497', '369281ebb16758aff6c1aeb84c60709e', 'Seeker User 34', 'job_seeker'),
('seeker35@example.com', '7b369cdc65df6e7dad422d1e5bef01f875d82d253c99952d90a7d4d115177392', '40923e8123ef339eb37db90a8243c3ee', 'Seeker User 35', 'job_seeker');