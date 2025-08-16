import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './{{componentName}}.css';

/**
 * {{componentDescription}}
 * Displays game leaderboard with filtering and pagination
 * 
 * @param {Object} props - Component props
 * @param {string} props.gameMode - Game mode filter
 * @param {string} props.difficulty - Difficulty filter
 * @param {number} props.maxEntries - Maximum entries to display
 * @param {boolean} props.autoRefresh - Auto refresh leaderboard
 * @param {Function} props.onPlayerSelect - Callback when player selected
 * @returns {JSX.Element} {{componentName}} component
 */
function {{componentName}}({ 
  gameMode = 'all',
  difficulty = 'all',
  maxEntries = 10,
  autoRefresh = false,
  onPlayerSelect 
}) {
  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Filter state
  const [selectedGameMode, setSelectedGameMode] = useState(gameMode);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [sortBy, setSortBy] = useState('{{defaultSortField}}');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('{{defaultViewMode}}'); // 'compact', 'detailed', 'cards'
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(maxEntries);
  const [totalEntries, setTotalEntries] = useState(0);

  // Available filter options
  const [gameModes, setGameModes] = useState([]);
  const [difficulties] = useState(['all', 'easy', 'medium', 'hard']);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (selectedGameMode !== 'all') params.append('game_mode', selectedGameMode);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      params.append('limit', (entriesPerPage * currentPage).toString());
      
      const response = await axios.get(`{{apiBaseUrl}}/leaderboard?${params}`);
      
      const data = response.data;
      setLeaderboard(data.leaderboard || []);
      setTotalEntries(data.total_scores || 0);
      setLastUpdated(new Date());
      
      // Extract unique game modes
      const uniqueModes = [...new Set(data.leaderboard?.map(entry => entry.game_mode) || [])];
      setGameModes(['all', ...uniqueModes]);
      
    } catch (error) {
      console.error('리더보드 조회 오류:', error);
      setError('리더보드를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchLeaderboard();
  }, [selectedGameMode, selectedDifficulty, currentPage, entriesPerPage]);

  // Auto refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchLeaderboard, {{refreshInterval}});
      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedGameMode, selectedDifficulty]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setCurrentPage(1); // Reset to first page
    
    switch (filterType) {
      case 'gameMode':
        setSelectedGameMode(value);
        break;
      case 'difficulty':
        setSelectedDifficulty(value);
        break;
      case 'entriesPerPage':
        setEntriesPerPage(parseInt(value));
        break;
      default:
        break;
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Sort leaderboard data
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortOrder === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Paginate data
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = sortedLeaderboard.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  // Handle player selection
  const handlePlayerClick = (player, rank) => {
    if (onPlayerSelect) {
      onPlayerSelect(player, rank);
    }
  };

  // Format display values
  const formatValue = (value, field) => {
    switch (field) {
      case 'score':
        return value.toLocaleString();
      case 'time':
      case 'duration':
        return formatTime(value);
      case 'timestamp':
      case 'end_time':
        return formatDate(value);
      default:
        return value;
    }
  };

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}초`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get rank display
  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  // Get difficulty badge
  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: { emoji: '🟢', label: '쉬움' },
      medium: { emoji: '🟡', label: '보통' },
      hard: { emoji: '🔴', label: '어려움' }
    };
    
    const badge = badges[difficulty] || { emoji: '⚪', label: difficulty };
    return `${badge.emoji} ${badge.label}`;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="{{cssClassName}} loading">
        <div className="loading-spinner"></div>
        <p>리더보드 로딩 중...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="{{cssClassName}} error">
        <h3>오류 발생</h3>
        <p>{error}</p>
        <button onClick={fetchLeaderboard} className="retry-button">
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={`{{cssClassName}} view-${viewMode}`}>
      
      {/* Header */}
      <div className="leaderboard-header">
        <h2>🏆 {{leaderboardTitle}}</h2>
        <div className="header-controls">
          <button onClick={fetchLeaderboard} className="refresh-button" disabled={loading}>
            🔄 새로고침
          </button>
          {lastUpdated && (
            <span className="last-updated">
              마지막 업데이트: {formatDate(lastUpdated.toISOString())}
            </span>
          )}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="leaderboard-controls">
        <div className="filters">
          <div className="filter-group">
            <label>게임 모드:</label>
            <select 
              value={selectedGameMode} 
              onChange={(e) => handleFilterChange('gameMode', e.target.value)}
            >
              {gameModes.map(mode => (
                <option key={mode} value={mode}>
                  {mode === 'all' ? '전체' : mode}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>난이도:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? '전체' : getDifficultyBadge(diff)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>표시 개수:</label>
            <select 
              value={entriesPerPage} 
              onChange={(e) => handleFilterChange('entriesPerPage', e.target.value)}
            >
              <option value={5}>5개</option>
              <option value={10}>10개</option>
              <option value={25}>25개</option>
              <option value={50}>50개</option>
            </select>
          </div>
        </div>
        
        <div className="view-controls">
          <label>보기 모드:</label>
          <div className="view-mode-buttons">
            <button 
              className={viewMode === 'compact' ? 'active' : ''}
              onClick={() => setViewMode('compact')}
            >
              📋 간단
            </button>
            <button 
              className={viewMode === 'detailed' ? 'active' : ''}
              onClick={() => setViewMode('detailed')}
            >
              📊 상세
            </button>
            <button 
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
            >
              🃏 카드
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      {paginatedData.length === 0 ? (
        <div className="empty-leaderboard">
          <p>표시할 데이터가 없습니다.</p>
          <p>필터 조건을 변경해보세요.</p>
        </div>
      ) : (
        <>
          {/* Compact View */}
          {viewMode === 'compact' && (
            <div className="leaderboard-table compact">
              <div className="table-header">
                <div className="rank-col" onClick={() => handleSort('rank')}>
                  순위 {sortBy === 'rank' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="{{primaryMetric}}-col" onClick={() => handleSort('{{primaryMetric}}')}>
                  {{primaryMetricLabel}} {sortBy === '{{primaryMetric}}' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="mode-col" onClick={() => handleSort('game_mode')}>
                  모드 {sortBy === 'game_mode' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
                <div className="date-col" onClick={() => handleSort('timestamp')}>
                  날짜 {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </div>
              
              {paginatedData.map((entry, index) => {
                const rank = startIndex + index + 1;
                return (
                  <div 
                    key={entry.id || index} 
                    className="table-row"
                    onClick={() => handlePlayerClick(entry, rank)}
                  >
                    <div className="rank-col">{getRankDisplay(rank)}</div>
                    <div className="{{primaryMetric}}-col">{formatValue(entry.{{primaryMetric}}, '{{primaryMetric}}')}</div>
                    <div className="mode-col">{entry.game_mode}</div>
                    <div className="date-col">{formatValue(entry.timestamp, 'timestamp')}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed View */}
          {viewMode === 'detailed' && (
            <div className="leaderboard-table detailed">
              <div className="table-header">
                {{detailedViewHeaders}}
              </div>
              
              {paginatedData.map((entry, index) => {
                const rank = startIndex + index + 1;
                return (
                  <div 
                    key={entry.id || index} 
                    className="table-row"
                    onClick={() => handlePlayerClick(entry, rank)}
                  >
                    {{detailedViewColumns}}
                  </div>
                );
              })}
            </div>
          )}

          {/* Cards View */}
          {viewMode === 'cards' && (
            <div className="leaderboard-cards">
              {paginatedData.map((entry, index) => {
                const rank = startIndex + index + 1;
                return (
                  <div 
                    key={entry.id || index} 
                    className={`leaderboard-card ${rank <= 3 ? 'top-rank' : ''}`}
                    onClick={() => handlePlayerClick(entry, rank)}
                  >
                    <div className="card-rank">{getRankDisplay(rank)}</div>
                    <div className="card-content">
                      <div className="primary-stat">
                        <span className="stat-value">{formatValue(entry.{{primaryMetric}}, '{{primaryMetric}}')}</span>
                        <span className="stat-label">{{primaryMetricLabel}}</span>
                      </div>
                      
                      <div className="card-details">
                        {{cardViewDetails}}
                      </div>
                      
                      <div className="card-meta">
                        <span className="game-mode">{entry.game_mode}</span>
                        <span className="difficulty">{getDifficultyBadge(entry.difficulty)}</span>
                        <span className="date">{formatValue(entry.timestamp, 'timestamp')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            ⏮️ 처음
          </button>
          
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-button"
          >
            ⬅️ 이전
          </button>
          
          <span className="page-info">
            {currentPage} / {totalPages} 페이지 (총 {totalEntries}개)
          </span>
          
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            다음 ➡️
          </button>
          
          <button 
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="page-button"
          >
            마지막 ⏭️
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="leaderboard-footer">
        <p>총 {totalEntries}개의 기록이 있습니다.</p>
        {autoRefresh && <p>🔄 자동 새로고침: {{refreshInterval/1000}}초마다</p>}
      </div>
      
    </div>
  );
}

export default {{componentName}};

/*
Leaderboard Component Template Usage:
1. Replace {{componentName}} with component name (e.g., GameLeaderboard)
2. Replace {{componentDescription}} with component description
3. Replace {{defaultSortField}} with default sort field (e.g., 'score', 'time')
4. Replace {{defaultViewMode}} with default view mode ('compact', 'detailed', 'cards')
5. Replace {{apiBaseUrl}} with API base URL (e.g., 'http://localhost:8000')
6. Replace {{refreshInterval}} with auto-refresh interval in milliseconds
7. Replace {{cssClassName}} with main CSS class name
8. Replace {{leaderboardTitle}} with leaderboard title
9. Replace {{primaryMetric}} with primary metric field name (e.g., 'score', 'time')
10. Replace {{primaryMetricLabel}} with primary metric display label
11. Replace {{detailedViewHeaders}} with detailed view table headers JSX
12. Replace {{detailedViewColumns}} with detailed view table columns JSX
13. Replace {{cardViewDetails}} with card view details JSX

Example for Game Leaderboard:
- componentName: "GameLeaderboard"
- defaultSortField: "score"
- defaultViewMode: "compact"
- apiBaseUrl: "http://localhost:8000"
- refreshInterval: "30000"
- cssClassName: "game-leaderboard"
- leaderboardTitle: "게임 리더보드"
- primaryMetric: "score"
- primaryMetricLabel: "점수"

For "Don't Push Button" Game:
- primaryMetric: "time"
- primaryMetricLabel: "버틴 시간"
- leaderboardTitle: "버튼 참기 리더보드"
*/