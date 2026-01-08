const categoryMapping = {
    'react': '1633356122544-f134324a6cee',
    'vue': '1633356122544-f134324a6cee',
    'angular': '1633356122544-f134324a6cee',
    'html': '1555099962-4199c345e5dd',
    'css': '1555099962-4199c345e5dd',
    'frontend': '1547658719-da2b51169166',
    'web': '1547658719-da2b51169166',
    'java': '1517694712202-14dd9538aa97',
    'spring': '1517694712202-14dd9538aa97',
    'python': '1526379095098-e92291e95815',
    'c++': '1515879218367-8466d910aaa4',
    'golang': '1562813733-b31f71025d54',
    'node': '1498050108023-c5249f4df085',
    'backend': '1555066931-4365d14bab8c',
    'data': '1551288049-bebda4e38f71',
    'analysis': '1551288049-bebda4e38f71',
    'ai': '1555949963-ff9fe0c870eb',
    'ml': '1555949963-ff9fe0c870eb',
    'machine': '1555949963-ff9fe0c870eb',
    'robot': '1677442120370-9831d1c34a2e',
    'android': '1607252650355-f7fd0460ccdb',
    'ios': '1512941937637-9cca28a05459',
    'flutter': '1512941937637-9cca28a05459',
    'mobile': '1512941937637-9cca28a05459',
    'docker': '1605745341401-a7a28ebf96db',
    'cloud': '1484557985045-6f5e69dfbe10',
    'devops': '1667372393119-3d4c48d07fc9',
    'code': '1542831371-29b0f74f9713',
    'laptop': '1498050108023-c5249f4df085',
    'tech': '1518770660439-4636190af475'
};
const fallbacks = [
    categoryMapping.code,
    categoryMapping.laptop,
    categoryMapping.tech,
    '1531297422935-408c02177229',
    '1517694712202-14dd9538aa97'
];
export const getCourseImage = (title) => {
    if (!title) return `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop`;
    const lower = title.toLowerCase();
    for (const [key, id] of Object.entries(categoryMapping)) {
        if (lower.includes(key)) {
            return `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop`;
        }
    }
    const index = title.length % fallbacks.length;
    return `https://images.unsplash.com/photo-${fallbacks[index]}?w=800&auto=format&fit=crop`;
};
