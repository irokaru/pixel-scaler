use tauri::command;
use dirs::home_dir;

#[command]
pub fn get_home_dir() -> String {
  home_dir()
    .map(|path| path.to_string_lossy().to_string())
    .unwrap_or_default()
}
