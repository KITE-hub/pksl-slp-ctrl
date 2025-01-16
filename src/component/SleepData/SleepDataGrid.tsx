import {DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid';
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {SleepDataGridProps} from '../../types';

const formatTime = (timeArray: number[]) => {
  const hours = String(timeArray[0]).padStart(2, '0');
  const minutes = String(timeArray[1]).padStart(2, '0');
  return `${hours}:${minutes}`;
};

function SleepDataGrid({sleepData, setSleepData}: SleepDataGridProps) {
  const handleDeleteClick = (index: number) => {
    const updatedSleepData = sleepData.filter((_, i) => i !== index);
    setSleepData(updatedSleepData);
  };

  const rows: GridRowsProp = sleepData.map((item, index) => ({
    id: index,
    ...item
  }));

  const columns: GridColDef[] = [
    {
      field: 'action',
      headerName: '',
      width: 5,
      renderCell: (params) => {
        const index = params.row.id;
        return (
          <div className="flex h-full w-full justify-center items-center">
            <IconButton aria-label="actions" onClick={() => handleDeleteClick(index)}>
              <DeleteIcon sx={{color: '#666'}} />
            </IconButton>
          </div>
        );
      },
      hideSortIcons: true,
      sortingOrder: [null]
    },
    {
      field: 'date',
      headerName: '日付',
      flex: 95,
      minWidth: 95,
      renderCell: (params) => {
        return (
          <div className="flex flex-col h-full justify-center">
            <div className="leading-none mb-1 text-[13px]">
              {params.row.date[0]}/{String(params.row.date[1]).padStart(2, '0')}/
              {String(params.row.date[2]).padStart(2, '0')}
            </div>
            <div className="text-xs">
              就寝: {formatTime(params.row.startTime)}
              <br />
              起床: {formatTime(params.row.endTime)}
            </div>
          </div>
        );
      },
      hideSortIcons: true,
      sortingOrder: [null]
    },
    {
      field: 'startTime',
      headerName: '睡眠スコア',
      headerClassName: 'small-header',
      flex: 85,
      minWidth: 85,
      renderCell: (params) => {
        const sleepTime =
          (((((params.row.endTime[0] - params.row.startTime[0]) * 60) % 1440) + 1440) % 1440) +
          params.row.endTime[1] -
          params.row.startTime[1];
        const hour = Math.floor(sleepTime / 60);
        const score = Math.min(100, Math.floor((sleepTime * 100) / (8.5 * 60) + 0.5));
        const img = `radial-gradient(#ffffff 50%, transparent 51%), conic-gradient(#489eff 0% ${score}%, #dddddd ${score + 1}% 100%)`;
        return (
          <div className="flex flex-col h-full w-16 justify-center items-center">
            <div
              className="pie flex justify-center items-center flex-shrink-0 w-10 h-10 text-xs font-bold rounded-full text-[#489eff]"
              style={{backgroundImage: img}}
            >
              {score}
            </div>
            <span className="text-xs">
              ({hour}時間{sleepTime - hour * 60}分)
            </span>
          </div>
        );
      },
      hideSortIcons: true,
      sortingOrder: [null]
    },
    {
      field: 'sleepType',
      headerName: '睡眠タイプ',
      headerClassName: 'small-header',
      flex: 130,
      minWidth: 130,
      renderCell: (params) => {
        if (params.row.sleepType === 'うとうと') {
          return (
            <div className="flex flex-col h-full w-24 justify-center items-start">
              <span className="text-[#795516] bg-[#ffec6f] rounded-full py-0.5 px-3 leading-snug text-center">
                うとうと
              </span>
              <div className="flex leading-snug mt-1">
                <span className="text-[#976a1c] mr-1">{params.row.sleepRate[0]}%</span>-
                <span className="text-[#1b8198] mx-1">{params.row.sleepRate[1]}%</span>-
                <span className="text-[#173e82] ml-1">{params.row.sleepRate[2]}%</span>
              </div>
            </div>
          );
        } else if (params.row.sleepType === 'すやすや') {
          return (
            <div className="flex flex-col h-full w-24 justify-center items-start">
              <span className="text-[#166A7C] bg-[#85fbff] rounded-full py-0.5 px-3 leading-snug text-center">
                すやすや
              </span>
              <div className="flex leading-snug mt-1">
                <span className="text-[#976a1c] mr-1">{params.row.sleepRate[0]}%</span>-
                <span className="text-[#1b8198] mx-1">{params.row.sleepRate[1]}%</span>-
                <span className="text-[#173e82] ml-1">{params.row.sleepRate[2]}%</span>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col h-full w-24 justify-center items-start">
              <span className="text-white bg-[#4488fb] rounded-full py-0.5 px-3 leading-snug text-center">
                ぐっすり
              </span>
              <div className="flex leading-snug mt-1">
                <span className="text-[#976a1c] mr-1">{params.row.sleepRate[0]}%</span>-
                <span className="text-[#1b8198] mx-1">{params.row.sleepRate[1]}%</span>-
                <span className="text-[#173e82] ml-1">{params.row.sleepRate[2]}%</span>
              </div>
            </div>
          );
        }
      },
      hideSortIcons: true,
      sortingOrder: [null]
    }
  ];

  return (
    <div className="SleepDataGrid">
      <DataGrid
        rows={rows}
        columns={columns}
        density="comfortable"
        rowHeight={44}
        columnHeaderHeight={24}
        initialState={{
          pagination: {paginationModel: {pageSize: 10}}
        }}
        disableColumnMenu={true}
        rowSelection={false}
        sx={{
          border: 'none',
          fontFamily:
            // eslint-disable-next-line
            "'M PLUS 1p','Roboto','Noto Sans JP', 'Helvetica Neue', 'Helvetica', 'Hiragino Sans', 'Arial', 'Yu Gothic', 'Meiryo', sans-serif",
          color: '#333',
          '& .small-header': {
            fontSize: '0.8rem'
          }
        }}
      />
    </div>
  );
}

export default SleepDataGrid;
