import { collection, config, fields, singleton } from '@keystatic/core';

const socialIconOptions = [
  { label: 'GitHub', value: 'github' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Telegram', value: 'telegram' },
  { label: 'SoundCloud', value: 'soundcloud' },
  { label: 'Bandcamp', value: 'bandcamp' },
  { label: 'Spotify', value: 'spotify' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Website', value: 'link' },
] as const;

const projectStatusOptions = [
  { label: 'Запущенные', value: 'launched' },
  { label: 'В работе', value: 'in_progress' },
  { label: 'Архив / Идеи', value: 'archive' },
] as const;

const contactProviderOptions = [
  { label: 'Telegram', value: 'telegram' },
  { label: 'Email (SMTP)', value: 'smtp' },
] as const;

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Portfolio CMS' },
    navigation: {
      Контент: ['projects', 'releases', 'posts', '---', 'about', 'settings'],
    },
  },
  singletons: {
    settings: singleton({
      label: 'Site settings',
      path: 'content/settings',
      format: { data: 'json' },
      schema: {
        ownerName: fields.text({
          label: 'Имя (Hero)',
          defaultValue: 'Ваше имя',
          validation: { isRequired: true },
        }),
        intro: fields.text({
          label: 'Короткое интро (Hero)',
          defaultValue: 'Разработчик и музыкант. Делаю продукты и звук.',
          multiline: true,
        }),
        taglines: fields.array(
          fields.text({ label: 'Фраза', defaultValue: 'Создатель' }),
          {
            label: 'Taglines (цикл)',
            itemLabel: (props) =>
              (props.value as unknown as string) || 'Tagline',
            validation: { length: { min: 1 } },
          },
        ),
        visuals: fields.object(
          {
            defaultTheme: fields.select({
              label: 'Тема по умолчанию',
              options: [
                { label: 'Тёмная', value: 'dark' },
                { label: 'Светлая', value: 'light' },
              ],
              defaultValue: 'dark',
            }),
            accentCode: fields.text({
              label: 'Акцент (код)',
              defaultValue: '#00f5d4',
              validation: {
                pattern: {
                  regex: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
                  message: 'Ожидается HEX цвет, например #00f5d4',
                },
              },
            }),
            accentMusic: fields.text({
              label: 'Акцент (музыка)',
              defaultValue: '#f20089',
              validation: {
                pattern: {
                  regex: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
                  message: 'Ожидается HEX цвет, например #f20089',
                },
              },
            }),
          },
          { label: 'Визуальные настройки', layout: [6, 3, 3] },
        ),
        sections: fields.object(
          {
            showAbout: fields.checkbox({ label: 'Показывать About', defaultValue: true }),
            showProjects: fields.checkbox({
              label: 'Показывать Projects',
              defaultValue: true,
            }),
            showMusic: fields.checkbox({
              label: 'Показывать Music',
              defaultValue: true,
            }),
            showBlog: fields.checkbox({ label: 'Показывать Blog', defaultValue: true }),
            showContact: fields.checkbox({
              label: 'Показывать Contact',
              defaultValue: true,
            }),
          },
          { label: 'Видимость секций', layout: [12, 12, 12, 12, 12] },
        ),
        socialLinks: fields.array(
          fields.object(
            {
              label: fields.text({
                label: 'Название',
                defaultValue: 'GitHub',
                validation: { isRequired: true },
              }),
              url: fields.url({
                label: 'URL',
                validation: { isRequired: true },
              }),
              icon: fields.select({
                label: 'Иконка',
                options: socialIconOptions,
                defaultValue: 'github',
              }),
            },
            { label: 'Соцсеть', layout: [4, 6, 2] },
          ),
          { label: 'Социальные ссылки', itemLabel: (props) => (props.fields.label.value as string) },
        ),
        footer: fields.object(
          {
            copyright: fields.text({
              label: 'Копирайт',
              defaultValue: `© ${new Date().getFullYear()}`,
            }),
            quotes: fields.array(fields.text({ label: 'Цитата', defaultValue: 'Build. Ship. Repeat.' }), {
              label: 'Цитаты (рандом в футере)',
            }),
          },
          { label: 'Footer' },
        ),
        contact: fields.conditional(
          fields.select({
            label: 'Канал доставки',
            options: contactProviderOptions,
            defaultValue: 'telegram',
            description:
              'Секреты (SMTP пароль/Telegram token) хранятся в .env, а не в CMS.',
          }),
          {
            telegram: fields.object(
              {
                chatId: fields.text({
                  label: 'Telegram chat_id',
                  description:
                    'Куда отправлять сообщения. Токен бота — в TELEGRAM_BOT_TOKEN.',
                  defaultValue: '',
                }),
              },
              { label: 'Telegram' },
            ),
            smtp: fields.object(
              {
                to: fields.text({
                  label: 'Email получателя',
                  description:
                    'Куда отправлять письма. SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS — в .env.',
                  defaultValue: '',
                }),
              },
              { label: 'SMTP' },
            ),
          },
        ),
      },
    }),
    about: singleton({
      label: 'About',
      path: 'content/about',
      format: { data: 'json', contentField: 'bio' },
      schema: {
        photo: fields.image({
          label: 'Фото',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images',
        }),
        bio: fields.markdoc({
          label: 'Текст “Обо мне”',
          description: '2–3 абзаца. Поддерживает заголовки/списки/код.',
        }),
        principles: fields.array(
          fields.object(
            {
              title: fields.text({
                label: 'Заголовок',
                defaultValue: 'Чётко и вовремя',
                validation: { isRequired: true },
              }),
              body: fields.text({
                label: 'Тезис',
                defaultValue: 'Делаю понятные обещания и выполняю их.',
                multiline: true,
              }),
              icon: fields.select({
                label: 'Иконка',
                options: [
                  { label: 'Sparkles', value: 'sparkles' },
                  { label: 'Code', value: 'code' },
                  { label: 'Music', value: 'music' },
                  { label: 'Shield', value: 'shield' },
                  { label: 'Rocket', value: 'rocket' },
                ],
                defaultValue: 'sparkles',
              }),
            },
            { label: 'Принцип', layout: [4, 6, 2] },
          ),
          { label: 'Принципы работы' },
        ),
        stack: fields.array(
          fields.object(
            {
              name: fields.text({
                label: 'Технология',
                defaultValue: 'TypeScript',
                validation: { isRequired: true },
              }),
              level: fields.number({
                label: 'Уровень (0–100)',
                defaultValue: 75,
                validation: { min: 0, max: 100, step: true },
                step: 5,
              }),
            },
            { label: 'Стек', layout: [8, 4] },
          ),
          { label: 'Технологический стек' },
        ),
      },
    }),
  },
  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'slug',
      path: 'content/projects/*',
      format: { data: 'json' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Название', validation: { isRequired: true } }),
        slug: fields.slug({
          name: { label: 'Slug source', defaultValue: 'project' },
          slug: { label: 'Slug' },
        }),
        status: fields.select({
          label: 'Статус',
          options: projectStatusOptions,
          defaultValue: 'launched',
        }),
        description: fields.text({ label: 'Описание', multiline: true }),
        tags: fields.array(fields.text({ label: 'Тег', defaultValue: 'Next.js' }), {
          label: 'Теги',
        }),
        cover: fields.image({
          label: 'Превью/скриншот',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images',
        }),
        links: fields.object(
          {
            demo: fields.url({ label: 'Демо' }),
            github: fields.url({ label: 'GitHub' }),
            case: fields.url({ label: 'Кейс' }),
          },
          { label: 'Ссылки', layout: [4, 4, 4] },
        ),
      },
      columns: ['title', 'status'],
    }),
    releases: collection({
      label: 'Music releases',
      slugField: 'slug',
      path: 'content/releases/*',
      format: { data: 'json' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Релиз', validation: { isRequired: true } }),
        slug: fields.slug({
          name: { label: 'Slug source', defaultValue: 'release' },
          slug: { label: 'Slug' },
        }),
        year: fields.integer({
          label: 'Год',
          defaultValue: new Date().getFullYear(),
          validation: { min: 1900, max: 2100 },
        }),
        genre: fields.text({ label: 'Жанр', defaultValue: 'Electronic' }),
        inspiration: fields.text({
          label: 'Вдохновение',
          multiline: true,
          defaultValue: '',
        }),
        gear: fields.text({
          label: 'Оборудование',
          multiline: true,
          defaultValue: '',
        }),
        cover: fields.image({
          label: 'Обложка',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images',
        }),
        audioPreview: fields.file({
          label: 'Аудио-превью (mp3/ogg)',
          directory: 'public/uploads/audio',
          publicPath: '/uploads/audio',
        }),
        links: fields.array(
          fields.object(
            {
              label: fields.text({ label: 'Площадка', defaultValue: 'Spotify' }),
              url: fields.url({ label: 'URL', validation: { isRequired: true } }),
            },
            { label: 'Ссылка', layout: [4, 8] },
          ),
          { label: 'Стриминги' },
        ),
      },
      columns: ['title', 'year'],
    }),
    posts: collection({
      label: 'Blog posts',
      slugField: 'slug',
      path: 'content/posts/*',
      format: { data: 'json', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.text({ label: 'Заголовок', validation: { isRequired: true } }),
        slug: fields.slug({
          name: { label: 'Slug source', defaultValue: 'post' },
          slug: { label: 'Slug' },
        }),
        date: fields.datetime({
          label: 'Дата',
          defaultValue: new Date().toISOString(),
        }),
        tags: fields.array(fields.text({ label: 'Тег', defaultValue: 'Код' }), {
          label: 'Теги',
        }),
        excerpt: fields.text({
          label: 'Превью (1–2 предложения)',
          multiline: true,
        }),
        cover: fields.image({
          label: 'Cover (опционально)',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images',
        }),
        content: fields.markdoc({
          label: 'Текст',
          description: 'Markdown/Markdoc редактор.',
        }),
      },
      columns: ['title', 'date'],
    }),
  },
});


