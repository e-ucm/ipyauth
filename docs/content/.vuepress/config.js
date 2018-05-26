module.exports = {
	title: 'ipyauth',
	description: 'OAuth2 authentication from inside Jupyter notebooks',
	base: '/ipyauth/',
	dest: '../public',
	head: [
		['link', { rel: 'icon', href: `/key.png` }],
	],
	// serviceWorker: true,
	themeConfig: {
		repo: 'https://gitlab.com/oscar6echo/ipyauth',
		editLinks: false,
		editLinkText: 'Edit this page on GitLab',
		lastUpdated: 'Last Updated',
		nav: [
			{
				text: 'Overview',
				link: '/overview/purpose',
			},
			{
				text: 'User Guide',
				link: '/guide/install',
			},
			{
				text: 'Development',
				link: '/dev/install'
			},
		],
		sidebarDepth: 5,
		sidebar:
			[
				{
					title: 'Overview',
					collapsable: false,
					children: [
						'/overview/purpose',
						'/overview/id_providers',
					]
				},
				{
					title: 'User Guide',
					collapsable: false,
					children: [
						// '',
						'/guide/install',
						'/guide/general',
						'/guide/Auth0',
						'/guide/Google',
					]
				},
				{
					title: 'Developer',
					collapsable: false,
					children: [
						'/dev/dev_install',
						'/dev/publish',
						'/dev/new_provider',
					]
				}
			],

	},
	markdown: {
		lineNumbers: false,
	}
}

