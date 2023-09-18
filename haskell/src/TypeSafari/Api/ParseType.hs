{-# LANGUAGE DeriveAnyClass #-}
{-# LANGUAGE DerivingStrategies #-}
{-# LANGUAGE RecordWildCards #-}

module TypeSafari.Api.ParseType where

import Data.Aeson
import GHC.Generics
import Data.Text (Text)
import Prelude

-- import TypeSafari.HindleyMilner.Parse (parseType, ParseTypeResult (..))

--------------------------------------------------------------------------------

newtype Input = Input {
    inputText :: Text
  }
  deriving stock (Show, Generic)
  deriving anyclass FromJSON

data Output = Output {
    outputType :: Maybe Text,
    outputError :: Maybe Text
  }
  deriving stock (Show, Generic)
  deriving anyclass ToJSON

--------------------------------------------------------------------------------

run :: Input -> IO Output
run _ = pure $ Output Nothing Nothing
-- run Input{..} = pure $
--   case parseType inputText of
--     Left err ->
--       Output {
--         outputType = Nothing,
--         outputError = Just err
--       }
--     Right ParseTypeResult{ parsedType } ->
--       Output {
--         outputType = Just $ pretty parsedType,
--         outputError = Nothing
--       }

dispError :: Text -> Output
dispError t =
  Output {
    outputType = Nothing,
    outputError = Just t
  }