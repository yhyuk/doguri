import { NavLink } from 'react-router-dom';
import { TOOLS, CATEGORIES } from '../../utils/constants';

export default function Sidebar() {
  const toolsByCategory = CATEGORIES.map(category => ({
    ...category,
    tools: TOOLS.filter(tool => tool.category === category.id)
  })).filter(cat => cat.tools.length > 0);

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">도구리</h1>
      </div>

      <nav className="p-4">
        {toolsByCategory.map(category => (
          <div key={category.id} className="mb-6">
            <h2 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {category.name}
            </h2>
            <ul className="space-y-1">
              {category.tools.map(tool => (
                <li key={tool.id}>
                  <NavLink
                    to={tool.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-medium border-l-3 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    {tool.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}