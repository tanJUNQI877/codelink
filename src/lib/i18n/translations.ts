export type LangCode =
  | "en" | "zh-CN" | "zh-TW" | "ja" | "ko"
  | "es" | "fr" | "de" | "ru" | "ar";

export const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
];

type TranslationMap = Record<string, Record<LangCode, string>>;

export const T: TranslationMap = {
  /* Navbar */
  "nav.brand": {
    en: "CodeLink", "zh-CN": "CodeLink", "zh-TW": "CodeLink",
    ja: "CodeLink", ko: "CodeLink", es: "CodeLink",
    fr: "CodeLink", de: "CodeLink", ru: "CodeLink", ar: "CodeLink",
  },
  "nav.login": {
    en: "Log In", "zh-CN": "登录", "zh-TW": "登入",
    ja: "ログイン", ko: "로그인", es: "Iniciar sesión",
    fr: "Connexion", de: "Anmelden", ru: "Войти", ar: "تسجيل الدخول",
  },
  "nav.signup": {
    en: "Sign Up", "zh-CN": "注册", "zh-TW": "註冊",
    ja: "サインアップ", ko: "회원가입", es: "Registrarse",
    fr: "S'inscrire", de: "Registrieren", ru: "Регистрация", ar: "اشتراك",
  },
  "nav.signout": {
    en: "Sign Out", "zh-CN": "退出登录", "zh-TW": "登出",
    ja: "ログアウト", ko: "로그아웃", es: "Cerrar sesión",
    fr: "Déconnexion", de: "Abmelden", ru: "Выйти", ar: "تسجيل الخروج",
  },

  /* Pricing */
  "pricing.heading": {
    en: "Choose Your Arsenal", "zh-CN": "选择你的武器库", "zh-TW": "選擇你的武器庫",
    ja: "武器庫を選択", ko: "무기고를 선택하세요", es: "Elige tu arsenal",
    fr: "Choisissez votre arsenal", de: "Wähle dein Arsenal", ru: "Выбери свой арсенал", ar: "اختر ترسانتك",
  },
  "pricing.subtitle": {
    en: "Select a plan that matches your cyber-warfare needs.",
    "zh-CN": "选择符合你网络战需求的方案。", "zh-TW": "選擇符合你網路戰需求的方案。",
    ja: "サイバー戦のニーズに合ったプランを選んでください。", ko: "사이버 전쟁 요구에 맞는 요금제를 선택하세요.",
    es: "Selecciona un plan que se adapte a tus necesidades de ciberguerra.",
    fr: "Sélectionnez un plan adapté à vos besoins de cyber-guerre.",
    de: "Wählen Sie einen Plan, der Ihren Cyber-Kriegsführungsanforderungen entspricht.",
    ru: "Выберите план, соответствующий вашим потребностям в кибервойне.",
    ar: "اختر خطة تناسب احتياجاتك في الحرب الإلكترونية.",
  },
  "pricing.badge": {
    en: "Recommended", "zh-CN": "推荐", "zh-TW": "推薦",
    ja: "おすすめ", ko: "추천", es: "Recomendado",
    fr: "Recommandé", de: "Empfohlen", ru: "Рекомендуется", ar: "موصى به",
  },

  /* Free Plan */
  "plan.free.title": {
    en: "免费白嫖档 Free", "zh-CN": "免费白嫖档 Free", "zh-TW": "免費白嫖檔 Free",
    ja: "無料版 Free", ko: "무료 등급 Free", es: "Nivel Gratuito Free",
    fr: "Niveau Gratuit Free", de: "Kostenlose Stufe Free", ru: "Бесплатный уровень Free", ar: "المستوى المجاني Free",
  },
  "plan.free.feature1": {
    en: "15 AI Prompts (Permanent)", "zh-CN": "15次 AI Prompt (永久)", "zh-TW": "15次 AI Prompt (永久)",
    ja: "15回 AIプロンプト (永久)", ko: "AI 프롬프트 15회 (영구)", es: "15 avisos de IA (Permanente)",
    fr: "15 invites IA (Permanent)", de: "15 KI-Abfragen (Dauerhaft)", ru: "15 AI-запросов (навсегда)", ar: "15 موجه AI (دائم)",
  },
  "plan.free.feature2": {
    en: "3-min page lifespan (Self-destruct)", "zh-CN": "3分钟生命/网页 (自毁)", "zh-TW": "3分鐘生命/網頁 (自毀)",
    ja: "3分のページ寿命 (自己破壊)", ko: "3분 페이지 수명 (자폭)", es: "3 min de vida útil (Autodestrucción)",
    fr: "3 min de durée de vie (Auto-destruction)", de: "3 min Lebensdauer (Selbstzerstörung)", ru: "3 мин жизни страницы (самоуничтожение)", ar: "عمر الصفحة 3 دقائق (تدمير ذاتي)",
  },
  "plan.free.feature3": {
    en: "Challenge extension up to 1 hour", "zh-CN": "游戏挑战延长至1小时", "zh-TW": "遊戲挑戰延長至1小時",
    ja: "チャレンジ延長最大1時間", ko: "챌린지 연장 최대 1시간", es: "Extensión de desafío hasta 1 hora",
    fr: "Extension de défi jusqu'à 1 heure", de: "Herausforderungsverlängerung bis zu 1 Stunde", ru: "Продление испытания до 1 часа", ar: "تمديد التحدي حتى ساعة واحدة",
  },
  "plan.free.button": {
    en: "Activate Free", "zh-CN": "立即白嫖", "zh-TW": "立即白嫖",
    ja: "無料で始める", ko: "무료로 시작", es: "Activar gratis",
    fr: "Activer gratuit", de: "Kostenlos aktivieren", ru: "Активировать бесплатно", ar: "تفعيل مجاني",
  },

  /* Hacker Plan */
  "plan.hacker.title": {
    en: "极客尝鲜档 Hacker", "zh-CN": "极客尝鲜档 Hacker", "zh-TW": "極客嚐鮮檔 Hacker",
    ja: "ハッカー版 Hacker", ko: "해커 등급 Hacker", es: "Nivel Hacker Hacker",
    fr: "Niveau Hacker Hacker", de: "Hacker-Stufe Hacker", ru: "Уровень хакера Hacker", ar: "مستوى الهاكر Hacker",
  },
  "plan.hacker.feature1": {
    en: "Unlimited AI (30s cooldown)", "zh-CN": "AI无限生成 (30秒冷却)", "zh-TW": "AI無限生成 (30秒冷卻)",
    ja: "AI無制限生成 (30秒クールダウン)", ko: "AI 무제한 생성 (30초 쿨다운)", es: "IA ilimitada (30s de recarga)",
    fr: "IA illimitée (30s de recharge)", de: "Unbegrenzte KI (30s Abklingzeit)", ru: "Безлимитный AI (30 сек перезарядка)", ar: "AI غير محدود (30 ثانية تبريد)",
  },
  "plan.hacker.feature2": {
    en: "Extend life 1 hour (no challenge)", "zh-CN": "续命1小时 (无挑战)", "zh-TW": "續命1小時 (無挑戰)",
    ja: "延命1時間 (チャレンジなし)", ko: "수명 연장 1시간 (챌린지 없음)", es: "Extender vida 1 hora (sin desafío)",
    fr: "Prolongation 1 heure (sans défi)", de: "Lebensverlängerung 1 Stunde (ohne Herausforderung)", ru: "Продление жизни на 1 час (без испытания)", ar: "تمديد العمر ساعة (بدون تحدي)",
  },
  "plan.hacker.feature3": {
    en: "Keep 3 permanent pages", "zh-CN": "保留3个永久网页", "zh-TW": "保留3個永久網頁",
    ja: "3つの永久ページを保持", ko: "영구 페이지 3개 보관", es: "Conservar 3 páginas permanentes",
    fr: "Garder 3 pages permanentes", de: "3 dauerhafte Seiten behalten", ru: "Хранить 3 постоянные страницы", ar: "الاحتفاظ بـ 3 صفحات دائمة",
  },
  "plan.hacker.price": {
    en: "$1/yr or $5/lifetime", "zh-CN": "$1/年 或 $5/终身", "zh-TW": "$1/年 或 $5/終身",
    ja: "$1/年 または $5/永久", ko: "$1/년 또는 $5/평생", es: "$1/año o $5/de por vida",
    fr: "1$/an ou 5$/à vie", de: "1$/Jahr oder 5$/lebenslang", ru: "$1/год или $5/навсегда", ar: "دولار واحد/السنة أو 5 دولارات/مدى الحياة",
  },
  "plan.hacker.button": {
    en: "Pay Now", "zh-CN": "瞬间氪金", "zh-TW": "瞬間氪金",
    ja: "今すぐ支払う", ko: "즉시 결제", es: "Pagar ahora",
    fr: "Payer maintenant", de: "Jetzt bezahlen", ru: "Заплатить сейчас", ar: "ادفع الآن",
  },

  /* Pro Plan */
  "plan.pro.title": {
    en: "尊荣高并发档 Pro", "zh-CN": "尊荣高并发档 Pro", "zh-TW": "尊榮高並發檔 Pro",
    ja: "プロ版 Pro", ko: "프로 등급 Pro", es: "Nivel Pro Pro",
    fr: "Niveau Pro Pro", de: "Pro-Stufe Pro", ru: "Про уровень Pro", ar: "المستوى الاحترافي Pro",
  },
  "plan.pro.feature1": {
    en: "Unlimited AI (10s cooldown)", "zh-CN": "AI无限生成 (10秒冷却)", "zh-TW": "AI無限生成 (10秒冷卻)",
    ja: "AI無制限生成 (10秒クールダウン)", ko: "AI 무제한 생성 (10초 쿨다운)", es: "IA ilimitada (10s de recarga)",
    fr: "IA illimitée (10s de recharge)", de: "Unbegrenzte KI (10s Abklingzeit)", ru: "Безлимитный AI (10 сек перезарядка)", ar: "AI غير محدود (10 ثانية تبريد)",
  },
  "plan.pro.feature2": {
    en: "Permanent save (no self-destruct)", "zh-CN": "永久保存 (不自毁)", "zh-TW": "永久保存 (不自毀)",
    ja: "永久保存 (自己破壊なし)", ko: "영구 저장 (자폭 없음)", es: "Guardado permanente (sin autodestrucción)",
    fr: "Sauvegarde permanente (pas d'auto-destruction)", de: "Dauerhaft speichern (keine Selbstzerstörung)", ru: "Постоянное сохранение (без самоуничтожения)", ar: "حفظ دائم (بدون تدمير ذاتي)",
  },
  "plan.pro.feature3": {
    en: "Custom domain (CNAME)", "zh-CN": "支持自定义域名 (CNAME)", "zh-TW": "支援自訂域名 (CNAME)",
    ja: "カスタムドメイン対応 (CNAME)", ko: "사용자 정의 도메인 지원 (CNAME)", es: "Dominio personalizado (CNAME)",
    fr: "Domaine personnalisé (CNAME)", de: "Benutzerdefinierte Domain (CNAME)", ru: "Свой домен (CNAME)", ar: "نطاق مخصص (CNAME)",
  },
  "plan.pro.feature4": {
    en: "Keep 50 permanent pages", "zh-CN": "保留50个永久网页", "zh-TW": "保留50個永久網頁",
    ja: "50の永久ページを保持", ko: "영구 페이지 50개 보관", es: "Conservar 50 páginas permanentes",
    fr: "Garder 50 pages permanentes", de: "50 dauerhafte Seiten behalten", ru: "Хранить 50 постоянных страниц", ar: "الاحتفاظ بـ 50 صفحة دائمة",
  },
  "plan.pro.price": {
    en: "$19/yr or $49/lifetime", "zh-CN": "$19/年 或 $49/终身", "zh-TW": "$19/年 或 $49/終身",
    ja: "$19/年 または $49/永久", ko: "$19/년 또는 $49/평생", es: "$19/año o $49/de por vida",
    fr: "19$/an ou 49$/à vie", de: "19$/Jahr oder 49$/lebenslang", ru: "$19/год или $49/навсегда", ar: "19 دولارًا/السنة أو 49 دولارًا/مدى الحياة",
  },
  "plan.pro.button": {
    en: "Go Pro", "zh-CN": "富哥专享", "zh-TW": "富哥專享",
    ja: "Proを購入", ko: "Pro 구매", es: "Ir a Pro",
    fr: "Passer à Pro", de: "Zu Pro wechseln", ru: "Перейти на Pro", ar: "احصل على Pro",
  },

  /* Workspace */
  "ws.heading": {
    en: "> Spawn Interface", "zh-CN": "> 生成界面", "zh-TW": "> 生成介面",
    ja: "> 生成インターフェース", ko: "> 생성 인터페이스", es: "> Interfaz de generación",
    fr: "> Interface de génération", de: "> Generierungsoberfläche", ru: "> Интерфейс генерации", ar: "> واجهة التوليد",
  },
  "ws.plan": {
    en: "Plan:", "zh-CN": "方案:", "zh-TW": "方案:",
    ja: "プラン:", ko: "요금제:", es: "Plan:",
    fr: "Forfait:", de: "Plan:", ru: "План:", ar: "الخطة:",
  },
  "ws.credits": {
    en: "Credits:", "zh-CN": "次数:", "zh-TW": "次數:",
    ja: "クレジット:", ko: "크레딧:", es: "Créditos:",
    fr: "Crédits:", de: "Guthaben:", ru: "Кредиты:", ar: "الرصيد:",
  },
  "ws.promptLabel": {
    en: "PROMPT", "zh-CN": "提示词", "zh-TW": "提示詞",
    ja: "プロンプト", ko: "프롬프트", es: "PROMPT",
    fr: "PROMPT", de: "PROMPT", ru: "ПРОМПТ", ar: "الموجه",
  },
  "ws.promptPlaceholder": {
    en: "> Describe the web app/game you want to spawn...",
    "zh-CN": "> 描述你想要生成的网页应用或游戏...",
    "zh-TW": "> 描述你想要生成的網頁應用或遊戲...",
    ja: "> 生成したいウェブアプリやゲームを説明してください...",
    ko: "> 생성하려는 웹 앱/게임을 설명하세요...",
    es: "> Describe la aplicación web o el juego que deseas generar...",
    fr: "> Décrivez l'application web ou le jeu que vous souhaitez générer...",
    de: "> Beschreibe die Web-App oder das Spiel, das du generieren möchtest...",
    ru: "> Опишите веб-приложение или игру, которые вы хотите создать...",
    ar: "> صف تطبيق الويب أو اللعبة التي تريد توليدها...",
  },
  "ws.lifespanLabel": {
    en: "LIFESPAN", "zh-CN": "生命周期", "zh-TW": "生命週期",
    ja: "寿命", ko: "수명", es: "DURACIÓN",
    fr: "DURÉE DE VIE", de: "LEBENSDAUER", ru: "СРОК ЖИЗНИ", ar: "مدة الحياة",
  },
  "ws.minLabel": {
    en: "3 min", "zh-CN": "3 分钟", "zh-TW": "3 分鐘",
    ja: "3 分", ko: "3 분", es: "3 min",
    fr: "3 min", de: "3 Min", ru: "3 мин", ar: "3 دقائق",
  },
  "ws.maxLabel": {
    en: "24 h", "zh-CN": "24 小时", "zh-TW": "24 小時",
    ja: "24 時間", ko: "24 시간", es: "24 h",
    fr: "24 h", de: "24 Std", ru: "24 ч", ar: "24 ساعة",
  },
  "ws.upgradeWarning": {
    en: "Upgrade to Hacker/Pro to unlock up to 24 hours lifespan.",
    "zh-CN": "升级到 Hacker/Pro 以解锁最长24小时生命周期。",
    "zh-TW": "升級到 Hacker/Pro 以解鎖最長24小時生命週期。",
    ja: "24時間の寿命を解除するにはHacker/Proにアップグレードしてください。",
    ko: "최대 24시간 수명을 잠금 해제하려면 Hacker/Pro로 업그레이드하세요.",
    es: "Actualiza a Hacker/Pro para desbloquear hasta 24 horas de duración.",
    fr: "Passez à Hacker/Pro pour débloquer jusqu'à 24 heures de durée de vie.",
    de: "Upgrade auf Hacker/Pro, um bis zu 24 Stunden Lebensdauer freizuschalten.",
    ru: "Перейдите на Hacker/Pro, чтобы разблокировать до 24 часов жизни.",
    ar: "قم بالترقية إلى Hacker/Pro لفتح مدة حياة تصل إلى 24 ساعة.",
  },
  "ws.spawnButton": {
    en: "> SPAWN CODE", "zh-CN": "> 生成代码", "zh-TW": "> 生成程式碼",
    ja: "> コード生成", ko: "> 코드 생성", es: "> GENERAR CÓDIGO",
    fr: "> GÉNÉRER LE CODE", de: "> CODE GENERIEREN", ru: "> СГЕНЕРИРОВАТЬ КОД", ar: "> توليد الكود",
  },
  "ws.generating": {
    en: "GENERATING...", "zh-CN": "生成中...", "zh-TW": "生成中...",
    ja: "生成中...", ko: "생성 중...", es: "GENERANDO...",
    fr: "GÉNÉRATION...", de: "GENERIEREN...", ru: "ГЕНЕРАЦИЯ...", ar: "جارٍ التوليد...",
  },

  /* Modal */
  "modal.heading": {
    en: "Access CodeLink", "zh-CN": "访问 CodeLink", "zh-TW": "存取 CodeLink",
    ja: "CodeLinkにアクセス", ko: "CodeLink 접속", es: "Acceder a CodeLink",
    fr: "Accéder à CodeLink", de: "Auf CodeLink zugreifen", ru: "Доступ к CodeLink", ar: "الوصول إلى CodeLink",
  },
  "modal.subtitle": {
    en: "Authenticate with your hacker identity",
    "zh-CN": "使用你的黑客身份进行认证", "zh-TW": "使用你的黑客身份進行認證",
    ja: "ハッカーとして認証", ko: "해커 신원으로 인증", es: "Autentícate con tu identidad hacker",
    fr: "Authentifiez-vous avec votre identité de hacker", de: "Authentifiziere dich mit deiner Hacker-Identität",
    ru: "Авторизуйтесь с помощью хакерской идентичности", ar: "تحقق من هويتك كهاكر",
  },
  "modal.github": {
    en: "Continue with GitHub", "zh-CN": "使用 GitHub 继续", "zh-TW": "使用 GitHub 繼續",
    ja: "GitHubで続ける", ko: "GitHub로 계속", es: "Continuar con GitHub",
    fr: "Continuer avec GitHub", de: "Mit GitHub fortfahren", ru: "Продолжить с GitHub", ar: "المتابعة عبر GitHub",
  },
  "modal.google": {
    en: "Continue with Google", "zh-CN": "使用 Google 继续", "zh-TW": "使用 Google 繼續",
    ja: "Googleで続ける", ko: "Google로 계속", es: "Continuar con Google",
    fr: "Continuer avec Google", de: "Mit Google fortfahren", ru: "Продолжить с Google", ar: "المتابعة عبر Google",
  },

  /* Footer */
  "footer.terms": {
    en: "Terms of Service", "zh-CN": "服务条款", "zh-TW": "服務條款",
    ja: "利用規約", ko: "이용약관", es: "Términos del servicio",
    fr: "Conditions d'utilisation", de: "Nutzungsbedingungen", ru: "Условия использования", ar: "شروط الخدمة",
  },
  "footer.privacy": {
    en: "Privacy Policy", "zh-CN": "隐私政策", "zh-TW": "隱私政策",
    ja: "プライバシーポリシー", ko: "개인정보 처리방침", es: "Política de privacidad",
    fr: "Politique de confidentialité", de: "Datenschutzerklärung", ru: "Политика конфиденциальности", ar: "سياسة الخصوصية",
  },
  "footer.cookie": {
    en: "Cookie Policy", "zh-CN": "Cookie 政策", "zh-TW": "Cookie 政策",
    ja: "Cookieポリシー", ko: "쿠키 정책", es: "Política de cookies",
    fr: "Politique des cookies", de: "Cookie-Richtlinie", ru: "Политика Cookie", ar: "سياسة ملفات تعريف الارتباط",
  },
  "footer.contact": {
    en: "Contact Us", "zh-CN": "联系我们", "zh-TW": "聯絡我們",
    ja: "お問い合わせ", ko: "문의하기", es: "Contáctenos",
    fr: "Nous contacter", de: "Kontakt", ru: "Свяжитесь с нами", ar: "اتصل بنا",
  },
  "footer.copyright": {
    en: "© 2026 CodeLink", "zh-CN": "© 2026 CodeLink", "zh-TW": "© 2026 CodeLink",
    ja: "© 2026 CodeLink", ko: "© 2026 CodeLink", es: "© 2026 CodeLink",
    fr: "© 2026 CodeLink", de: "© 2026 CodeLink", ru: "© 2026 CodeLink", ar: "© 2026 CodeLink",
  },

  /* Errors */
  "error.notConfigured": {
    en: "Supabase not configured", "zh-CN": "Supabase 未配置", "zh-TW": "Supabase 未設定",
    ja: "Supabaseが設定されていません", ko: "Supabase가 구성되지 않았습니다", es: "Supabase no configurado",
    fr: "Supabase non configuré", de: "Supabase nicht konfiguriert", ru: "Supabase не настроен", ar: "لم يتم تكوين Supabase",
  },
  "error.notAuthenticated": {
    en: "Not authenticated", "zh-CN": "未登录", "zh-TW": "未登入",
    ja: "認証されていません", ko: "인증되지 않음", es: "No autenticado",
    fr: "Non authentifié", de: "Nicht authentifiziert", ru: "Не авторизован", ar: "غير مصرح به",
  },
  "error.network": {
    en: "Network error", "zh-CN": "网络错误", "zh-TW": "網路錯誤",
    ja: "ネットワークエラー", ko: "네트워크 오류", es: "Error de red",
    fr: "Erreur réseau", de: "Netzwerkfehler", ru: "Сетевая ошибка", ar: "خطأ في الشبكة",
  },
  "error.profileInsertFailed": {
    en: "Failed to activate plan. Check RLS policies in Supabase.",
    "zh-CN": "激活方案失败。请检查 Supabase 中的 RLS 策略。",
    "zh-TW": "啟用方案失敗。請檢查 Supabase 中的 RLS 策略。",
    ja: "プランの有効化に失敗しました。SupabaseのRLSポリシーを確認してください。",
    ko: "요금제 활성화에 실패했습니다. Supabase의 RLS 정책을 확인하세요.",
    es: "Error al activar el plan. Verifique las políticas RLS en Supabase.",
    fr: "Échec de l'activation du forfait. Vérifiez les politiques RLS dans Supabase.",
    de: "Fehler beim Aktivieren des Plans. Überprüfen Sie die RLS-Richtlinien in Supabase.",
    ru: "Не удалось активировать план. Проверьте политики RLS в Supabase.",
    ar: "فشل تفعيل الخطة. تحقق من سياسات RLS في Supabase.",
  },
  "error.noCredits": {
    en: "No credits remaining. Upgrade your plan.",
    "zh-CN": "剩余次数不足。请升级你的方案。",
    "zh-TW": "剩餘次數不足。請升級你的方案。",
    ja: "クレジットが不足しています。プランをアップグレードしてください。",
    ko: "크레딧이 부족합니다. 요금제를 업그레이드하세요.",
    es: "No quedan créditos. Actualiza tu plan.",
    fr: "Plus de crédits. Mettez à niveau votre forfait.",
    de: "Kein Guthaben mehr. Upgrade deinen Plan.",
    ru: "Недостаточно кредитов. Обновите план.",
    ar: "لا توجد أرصدة متبقية. قم بترقية خطتك.",
  },

  /* Lifespan formatting keys */
  "lifespan.minutes": {
    en: "{n} minutes", "zh-CN": "{n} 分钟", "zh-TW": "{n} 分鐘",
    ja: "{n} 分", ko: "{n} 분", es: "{n} minutos",
    fr: "{n} minutes", de: "{n} Minuten", ru: "{n} минут", ar: "{n} دقيقة",
  },
  "lifespan.hours": {
    en: "{n} hours", "zh-CN": "{n} 小时", "zh-TW": "{n} 小時",
    ja: "{n} 時間", ko: "{n} 시간", es: "{n} horas",
    fr: "{n} heures", de: "{n} Stunden", ru: "{n} часов", ar: "{n} ساعة",
  },
  "lifespan.hoursMinutes": {
    en: "{h} hours {m} minutes", "zh-CN": "{h} 小时 {m} 分钟", "zh-TW": "{h} 小時 {m} 分鐘",
    ja: "{h} 時間 {m} 分", ko: "{h}시간 {m}분", es: "{h} h {m} min",
    fr: "{h} h {m} min", de: "{h} Std {m} Min", ru: "{h} ч {m} мин", ar: "{h} ساعة {m} دقيقة",
  },
};

export function t(key: string, lang: LangCode): string {
  return T[key]?.[lang] ?? T[key]?.en ?? key;
}

export function formatLifespanI18n(minutes: number, lang: LangCode): string {
  if (minutes < 60) {
    return t("lifespan.minutes", lang).replace("{n}", String(minutes));
  }
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (m === 0) {
    return t("lifespan.hours", lang).replace("{n}", String(h));
  }
  return t("lifespan.hoursMinutes", lang)
    .replace("{h}", String(h))
    .replace("{m}", String(m));
}
